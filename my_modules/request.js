const req = require('request');
const iconv = require('iconv-lite');

const reqDelay = 50;
let reqLastTime = {
    'host.name': Date.now()
};


req.defaults({
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.103 Safari/537.36",
    jar: true, //enable cookies
    gzip: true,
});

module.exports.reqPromise = reqPromise;


/*
    request Promise version
    with encode change & request frequency limit
 */
function reqPromise(url='', encode='utf-8') {
    let hostName = getHostName(url);
    reqLastTime[hostName] = reqLastTime[hostName] || 0;

    return new Promise((ok, ko)=>{  
        insidePromise();
        function insidePromise() {
            if(Date.now() < reqDelay+reqLastTime[hostName])
                return setTimeout(insidePromise, 10);

            reqLastTime[hostName] = Date.now();

            req({
                url, 
                encoding: null //return buffer in body (can't set in defaults)
            }, (err, res, body)=>{
                if(!err && res.statusCode == 200) {
                    body = iconv.decode(body, encode);
                    return ok(body);
                }
                else
                    ko(`request ${url}: ${err}`);
            });
        }
    });
}


function getHostName(link='') {
    const URL = require('url');
    let url = URL.parse(link);
    return url.hostname;
}
