const C = require('./common'),
      //每次爬虫尝试次数上限
      reload_times0 = 20;

const http = require('http');

////////////////////////////////////

var ret = {},
    ret_time = 0,
    max_page = 1407,
    now_page;

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

    var get_url = '',
        reload_times = reload_times0;

    //0. 启动函数
    starter();
    function starter(err) {
        /*if(err)
            console.warn('爬虫错误：'+err);*/
        now_page = C.rnd_int(14, Math.floor(max_page*1.1) );
        get_url = 'http://wufazhuce.com/one/'+now_page;
        if(--reload_times>=0) {
            /*if(reload_times===reload_times0-1)
                console.log('爬虫开始运行');
            else
                console.log(`爬虫正在进行第${reload_times0-reload_times}次重试`);*/
            getHTML(dom_parse);
        }
        else {
            console.error('Saying one爬虫运行失败，且重试次数达到上限');
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
            $    = cheerio.load(html),
            obj  = {},
            test = $('.one-cita-wrapper>div.one-cita');

        if(!test.length)
            return starter(/*'随机访问到非名言页面'*/);
        else if(now_page > max_page)
            max_page = now_page;

        obj.cn    = test.text().trim();
        obj.cnFix = C.cnFix(obj.cn);
        obj.pic   = $('.one-imagen img').attr('src');
        obj.link  = 'http://wufazhuce.com/one/'+now_page;
        obj.date  = new Date($('.one-pubdate').text()).toLocaleDateString();

        //obj.oneID = $('.one-titulo').text().trim();
        obj.picBy = $('.one-imagen-leyenda').text().trim();

        //ret = JSON.stringify(obj);
        ret = obj;
        //console.log(ret);

        refreshing = false;
        ret_time   = C.getMS();
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
