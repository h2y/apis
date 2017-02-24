const req = require('request');
const iconv = require('iconv-lite');

const reqDelay = 50; //ms
let reqLastTime = {
    'host.name': Date.now()
};


req.defaults({
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.103 Safari/537.36",
    jar: true, //enable cookies
    gzip: true,
});


/*
    request Promise version
    with encode change & request frequency limit
 */
function requestVersion(url='', encode='utf-8') {
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


///////////////////////////////////////

const phantom = require('phantom'),
      co = require('co');

const phStratArgs = ['--load-images=no'];

let ph = {};                //phantom instance

let phIsUsing = 0,          //(count) only restart when nobody using
    phIsRestarting = true,  //block new using
    timesUsedPh = 0;        //restart after times

//init
phIsRestarting = true;
timesUsedPh = 9999999;
restartPh();

function restartPh() {
    if(timesUsedPh < 20) //restart after used times
        return setTimeout(restartPh, 5*60*1000); //check time: 5min
    
    //need restart
    co(function*() {
        phIsRestarting = true;
        console.log('start');
        while(phIsUsing>0) 
            yield promiseDelay(200);
        
        if(ph.exit)
            yield ph.exit();
        ph = yield phantom.create(phStratArgs);
        phIsUsing = timesUsedPh = 0;
            
        phIsRestarting = false;
        
        setTimeout(restartPh, 15*60*1000); //next check: 15min
    });
}


function phantomVersion(url='') {
    return co(function*() {
        
        //waiting for created ph
        let waitTimes = 0,
            waitTimesMax = 30; // >15s
        while(phIsRestarting) {
            if(++waitTimes > waitTimesMax)
                throw new Error('wait for start Phantom so long :(');
                
            yield promiseDelay(500);
        }
        
        timesUsedPh++;
        phIsUsing++;
        
        const page = yield ph.createPage();
        const status = yield page.open(url);
        if(status!=='success')
            throw new Error(`phantom ${url} - ${status}`);
            
        const content = yield page.property('content');
        
        yield page.stop();
        yield page.close();
        
        phIsUsing--;
        
        return content;
    });
}


function promiseDelay(time=1000) {
    return new Promise(ok=>{
       setTimeout(ok, time); 
    });
}



///////////////////////////////////////

module.exports.reqPromise = reqPromise;

/**
 * 封装获取源码的两种途径
 * 
 * @param {string} [url] 
 * @param {string} [encode='utf-8'] 
 * @param {boolean} [usePhantom=false] 
 * @returns {Promise}
 */
function reqPromise(url, encode='utf-8', usePhantom=false) {
    if(usePhantom)
        return phantomVersion(url);
    
    return requestVersion(url, encode);
}
