const restify = require('restify'),
      port = 10843;

var server = restify.createServer({
    'name':        'api.hzy.pw',
    'version':     '1.0.0'
});

//http://restify.com/#bundled-plugins
server.use(restify.acceptParser(server.acceptable));
//server.use(restify.queryParser());
//server.use(restify.jsonp());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());

server.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.charSet('utf-8');
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`[${new Date().toLocaleString()}]\t${ip}\t${req.url}`);
    next();
});


//Rss
server.get('/rss/v1/:task', require('./rss_maker/index').v1GET);


//listen
server.listen(port);
console.log(`listening on ${port}...`);
