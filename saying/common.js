var C = {
    //每条名言抓取之后的缓存时间
    'refresh_timeout': 1000,

    //每个采集任务的执行时间
    'task_timeout': 15*1000,

    // 返回当前时间 单位：毫秒
    'getMS': ()=>(new Date().getTime()),

    //生成随机的日期对象
    //随机从start到昨天中的一天
    'rnd_date': function(start = '2015-05-01') {
        start = new Date(start).getTime();
        var end = new Date().getTime();
        end -= 1 * 24 * 60 * 60 * 1000;
        return new Date(C.rnd_int(start, end));
    },

    //[a,b]区间内生成随机整数
    'rnd_int': (a = 0, b = 1)=> ( Math.floor(Math.random() * (b - a + 1) + a) ),

    //返回参数date日期对象的YYYY-MM-DD形式字符串
    'youdao_date_str': function(date = this.rnd_date()) {
        var str = date.getFullYear() + '-';

        var tmp = date.getMonth() + 1;
        str += tmp < 10 ? `0${tmp}` : tmp;

        tmp = date.getDate();
        return tmp < 10 ? `${str}-0${tmp}` : `${str}-${tmp}`;
    },

    // 删除名言末尾的署名
    'cnFix': (str) => {
        return str  //.replace(/^(.+。).{0,20}?$/, '$1')
                  .replace(/^(.+)by.{1,10}?$/i, '$1')
                  .replace(/^(.+)from.{2,15}?$/i, '$1')
                  .replace(/^(.+)《.{1,15}?》$/, '$1')
                  .replace(/^(.+)[-—].{1,15}?$/, '$1')
                  .replace(/^(.+)[(（].{1,20}?[)）]$/, '$1')
                  .trim();
    }
};


module.exports = C;
