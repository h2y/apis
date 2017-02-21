const jdenticon = require('jdenticon'),
      crypto = require('crypto');

const cacheBox = require('../my_modules/cache_box');


const cacheTime = 60*60*1000, //1h
      rndCacheTime = 500;


///////////////////////////////////////

function getAvatarSvg(id, size) {
      id = id || Math.random().toString();

      let md5 = crypto.createHash('md5').update(id);
      md5 = md5.digest('hex');

      let svg = jdenticon.toSvg(md5, size);

      return svg;
}


module.exports.v1GET = (req, res, next) => {
      const size = req.params.size || 150;
      let id = req.params.id;
      if(!id) 
            id = Math.floor( Date.now()/rndCacheTime ).toString();
            
      //test cache
      let svg = cacheBox.get(`avatar_${size}_${id}`, cacheTime).value;
      if(!svg) {
            svg = getAvatarSvg(id, size);
            cacheBox.set(`avatar_${size}_${id}`, svg, cacheTime);
      }
      
      //res
      res.writeHead(200, {
            'Content-Type': 'image/svg+xml'
      });
      res.write(svg);
      res.end();

      next();
};
