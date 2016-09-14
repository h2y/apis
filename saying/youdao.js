const C = require('./common'),
      //每次爬虫尝试次数上限
      reload_times0 = 10;

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
        get_url = 'http://xue.youdao.com/w?method=tinyEngData&date='+C.youdao_date_str(get_date);
        if(--reload_times>=0) {
            /*if(reload_times===reload_times0-1)
                console.log('爬虫开始运行');
            else
                console.log(`爬虫正在进行第${reload_times0-reload_times}次重试`);*/
            getHTML(dom_parse);
        }
        else {
            console.error('Saying youdao爬虫运行失败，且重试次数达到上限');
            refreshing = false;
            ret_time = C.getMS();
        }
    }

    //1. GET获取有道每日一句
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

            res.on('end', function(e){
                callback(get);
            });
        }).on('error', (e) => starter('发送GET请求时错误='+e) );
    }

    //2. DOM解析
    function dom_parse(html) {
        var cheerio = require('cheerio'),
            $ = cheerio.load(html),
            obj = {};

        var tmp = $('div.content p.trans');
        if(!tmp.length) {
            starter(/*'随机访问到非名言页面'*/);
            return;
        }
        obj.cn = tmp.text().trim();

        //未翻译的情况
        if(obj.cn.indexOf('???')>=0)
            return starter();

        obj.cnFix = C.cnFix(obj.cn);
        obj.en = $('div.content p.sen').text().trim();
        obj.date = get_date.toLocaleDateString();
        obj.pic = $('div.pic-show img').attr('src').replace(/(&?[wh]=\d+)/g, '');
        obj.link = 'http://study.youdao.com/w?date='+C.youdao_date_str(get_date);

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
