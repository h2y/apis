const req = require('request');

const reqDelay = 100;
let reqLastTime = 0;


req.defaults({
    agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.103 Safari/537.36",
    //enable cookies
    jar: true,
});


function reqPromise(url='') {
    return new Promise((ok, ko)=>{
        insidePromise();
        function insidePromise() {
            if(Date.now() < reqDelay+reqLastTime)
                return setTimeout(insidePromise, 10);

            reqLastTime = Date.now();
            req.get(url, (err, res, body)=>{
                if(!err && res.statusCode == 200)
                    return ok(body);
                else
                    ko(`request ${url}: ${err}`);
            });
        }
    });
}


module.exports.reqPromise = reqPromise;