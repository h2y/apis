const restify = require('restify'),
      fs = require('fs'),
      path = require("path"),
      port = 443;

var server = restify.createServer({
    'name': 'api.hzy.pw',
    'version': '1.0.0',
    'certificate': fs.readFileSync(	path.normalize('ssl/hzy.pw.crt') ),
    'key': fs.readFileSync(	path.normalize('ssl/hzy.pw.key') )
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[${new Date().toLocaleString()}]\t${ip}\t${req.url}`);
    next();
});


//saying
server.get('/saying/v1/ciba', require('./saying/ciba').v1GET);
server.get('/saying/v1/youdao', require('./saying/youdao').v1GET);
server.get('/saying/v1/one', require('./saying/one').v1GET);
//server.get('/saying/v1/any', require('./saying/common').v1GET_any);


//listen
server.listen(port);
console.log(`listening on ${port}...`);
