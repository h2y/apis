const C = require('./common'),
      //每次爬虫尝试次数上限
      reload_times0 = 3;

const http = require('http');

////////////////////////////////////

var ret = {},
    ret_time = 0;

//爬虫工作
var refreshing = false,
    refresh_start = new Date();
function refresh() {
    if(refreshing && C.getMS()-refresh_start > C.task_timeout)
        refreshing = false;

    if (refreshing || C.getMS() - ret_time < C.refresh_timeout)
        return;

    refreshing = true;
    refresh_start = new Date();

    var get_date,
        get_url = '',
        reload_times = reload_times0;

    //0. 启动函数
    starter();
    function starter(err) {
        /*if(err)
            console.warn('爬虫错误：'+err);*/
        get_date = C.rnd_date();
        get_url = 'http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title='+C.youdao_date_str(get_date);
        if(--reload_times>=0) {
            /*if(reload_times===reload_times0-1)
                console.log('爬虫开始运行');
            else
                console.warn(`爬虫正在进行第${reload_times0-reload_times}次重试`);*/
            getHTML(dom_parse);
        }
        else {
            console.error('Saying ciba爬虫运行失败，且重试次数达到上限');
            refreshing = false;
            ret_time = C.getMS();
        }
    }

    //1. GET获取每日一句
    function getHTML(callback) {
        http.get(get_url, function(res) {
            if(res.statusCode!=200) {
                starter(`GET statusCode=${res.statusCode}`);
                return;
            }
            res.on('error', function(e){
                starter(`GET error=${res.statusCode}`);
                return;
            });

            var get = '';

            res.on('data', e=> get += e );

            res.on('end', function(){
                try {
                    get = JSON.parse(get);
                }
                catch(e) {
                    starter('GET到的JSON解析失败');
                    return;
                }
                callback(get);
            });
        }).on('error', (e) => starter('发送GET请求时错误='+e) );
    }

    //2. JSON解析
    function dom_parse(json) {
        var obj = {};

        obj.cn = json.note.trim();
        obj.cnFix = C.cnFix(obj.cn);
        obj.en = json.content.trim();
        obj.pic = json.picture2;
        obj.date = get_date.toLocaleDateString();
        obj.link = `http://www.iciba.com/dailysentence/${json.sid}`;

        obj.picSmall = json.picture;
        obj.picSquare = json.picture3;
        obj.linkPC = `http://news.iciba.com/views/dailysentence/daily.html#!/detail/sid/${json.sid}`;

        ret = obj;

        refreshing = false;
        ret_time = C.getMS();
        //console.log(`随机名言刷新成功：${decodeURIComponent(obj.cn)}`);
    }
}





///////////////////////////////////////

refresh();

module.exports.v1GET = (req, res, next)=>{
    res.send(ret);
    next();

    refresh();
};
