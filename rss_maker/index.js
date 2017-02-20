const co = require('co');

const settings = require('./settings'),
      cacheBox = require('../my_modules/cache_box');
const {makeRss} = require('./rss');


//封装 respond 功能
function respondRss(str, res, next) {
    if(str.length > 50) {
        res.writeHead(200, {
            'Content-Type': 'application/rss+xml'
        });
        res.write(str);
        res.end();
    }
    else
        res.send(str);

    return next();
}


//响应请求
module.exports.v1GET = (req, res, next)=>{
    
    const reqTask = req.params.task;

    //test cache
    let cache = cacheBox.get('rssXML_'+reqTask);
    if(!cache.err) 
        return respondRss(cache.value, res, next);

    //get setting
    let setting = settings[reqTask];
    if(!setting) 
        return respondRss('unknow RSS: '+reqTask, res, next);

    //run
    co(makeRss.bind({setting, taskName:reqTask}))
    .then(xmlOut=>{
        respondRss(xmlOut, res, next);
    })
    .catch(e=>{
        console.log(reqTask+' rss index error: '+e);
        return respondRss('error', res, next);
    })

};



//初始执行内容
//运行自动刷新的任务
for(let taskName in settings) {
    let set = settings[taskName];
    if(!set.rssAutoRefresh) continue;

    let refreshTime = set.rssRefreshTime*60*1000;

    let runFunction = ()=>{
        co(makeRss.bind({setting:set, taskName}))
        .then(()=>{
            console.log(taskName+' rss refresh success.');
            setTimeout(runFunction, refreshTime);
        })
        .catch(e=>{
            console.log(taskName+' rss index fresh error: '+e);
            setTimeout(runFunction, refreshTime/2);
        });
    };

    runFunction();
}
