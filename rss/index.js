const co = require('co');

const settings = require('./settings'),
      cacheBox = require('../my_modules/cache_box');
const {makeRss} = require('./rss');



module.exports.v1GET = (req, res, next)=>{
    
    const reqTask = req.params.task || 'default';

    //test cache
    let cache = cacheBox.get('rssXML_'+reqTask);
    if(!cache.err) {
        res.writeHead(200, {
            'Content-Length': cache.value.length,
            'Content-Type': 'application/rss+xml'
        });
        res.write(cache.value);
        res.end();
        return next();
    }

    //get setting
    let setting = settings[reqTask],
        settingDef = setting.default;
    for(let key in settingDef)
        if(setting[key]===undefined)
            setting[key] = settingDef[key];

    //run
    co(makeRss.bind(setting))
    .then(xmlOut=>{
        res.writeHead(200, {
            'Content-Type': 'application/rss+xml'
        });
        res.write(xmlOut);
        res.end();
        
        cacheBox.set('rssXML_'+reqTask, xmlOut, setting.rssCacheTime*60*1000);
    })
    .catch(e=>{
        console.log(reqTask+' rss index error: '+e);
    })

    next();

};