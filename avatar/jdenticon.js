const jdenticon = require('jdenticon'),
      crypto    = require('crypto');


///////////////////////////////////////

module.exports.v1GET = (req, res, next)=>{
    const size = req.params.size || 150,
          id   = req.params.id || Math.random().toString();

    let md5 = crypto.createHash('md5').update(id);
    md5 = md5.digest('hex');

    let svg = jdenticon.toSvg(md5, size);

    res.writeHead(200, {
      //'Content-Length': svg.length,
      'Content-Type': 'image/svg+xml'
    });
    res.write(svg);
    res.end();

    next(); 
};
