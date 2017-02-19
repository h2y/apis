const caches = {};


module.exports.set = (key='key', value='defalt', timeout=5000)=>{
    let cacheOld = module.exports.get(key);

    caches[key] = {
        value:      value,
        maxTime:    Date.now() + timeout
    };

    return cacheOld;
};


module.exports.get = (key='key', addTimeout=0)=>{
    let cache = caches[key];

    if(!cache) 
        return {
            err:    1,
            errMsg: 'can`t match cache: '+key
        };

    if(cache.maxTime < Date.now()) {
        delete caches[key];
        return {
            err:    2,
            errMsg: 'cache is out of date: '+key
        };
    }


    cache.maxTime = Date.now() + addTimeout;

    return {
        err:        0,
        value:      cache.value,
        maxTime:    cache.maxTime
    }
};