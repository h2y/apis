module.exports.default = {
    //main info
    rssUrl: 'http://www.iapps.im/tags/iPad/',
    rssName: 'iPad 限时免费 - iApps',
    rssDesc: 'rss by Moshel (http://hzy.pw/)',
    rssNum: 30,
    rssCacheTime: 5, //min

    //in posts list
    listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: 'article div.entry-main > h2 > a',
    
    //in a post
    postTitleJ: 'div.entry-main > h1 > a',
    postTimeJ: 'div.entry-main > div.entry-meta > div.entry-meta-first',
    postTimePraser: timeStr=>new Date(),
    postContentsJ: 'article'
};


module.exports.iapps_ipad = {
    //main info
    rssUrl: 'http://www.iapps.im/tags/iPad/',
    rssName: 'iPad 限时免费 - iApps',
    rssNum: 5,

    //in posts list
    listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: 'article div.entry-main > h2 > a',
    
    //in a post
    postTitleJ: 'div.entry-main > h1 > a',
    postTimeJ: 'div.entry-main > div.entry-meta > div.entry-meta-first',
    postTimePraser: timeStr=>{
        return new Date();
    },
    postContentsJ: 'article'
};