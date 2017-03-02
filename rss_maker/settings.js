module.exports.iapps_ipad = {
    rssUrl: 'http://www.iapps.im/tags/iPad/',
    rssName: 'iPad 限时免费 - iApps',
    rssNum: 20, //10 per page

    listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: 'article div.entry-main > h2 > a',
    
    postTitleJ: 'div.entry-main > h1 > a',
    postRemoveJ: '.entry-content > div > div > a',
    postContentsJ: `aside.mb0 li.meta-item-app,
                    .entry-content, 
                    #slider img, 
                    #comment-list .comment-content`,

    postTimeJ: 'div.entry-main > div.entry-meta > div.entry-meta-first',
    postTimePraser: timeStr=>{
        let regexRet = timeStr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}/);
        if(regexRet)
            return new Date(regexRet[0]);
        console.log('iapps_ipad error time: '+timeStr);
        return new Date();
    },
};


module.exports.manshijian = {
    rssUrl: 'http://www.manshijian.com/home/more.html',
    rssName: '慢时间',
    rssNum: 5, //15 per page

    rssAutoRefresh: true,
    rssRefreshTime: 30, 

    //listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: '#left_body dd > h1 > a',
    
    postTitleJ: 'body > div.body_main.nobackground > div.left_in.detailed > div.new_content > h1',
    postRemoveJ: `.new_content h1, 
                  .new_content .botton,
                  .new_content .jiathis_style,
                  .new_content .gd-bg,
                  .new_content .wd-all`,
    postContentsJ: `.left_in.detailed > div.new_content`,

    postTimeJ: '.body_righ_serven > div > div:nth-child(3) > em',
    postTimePraser: timeStr=>{
        let regexRet = timeStr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/);
        if(regexRet)
            return new Date(regexRet[0]);
        return new Date();
    },
};


module.exports.zhidao_daily = {
    rssUrl: 'https://zhidao.baidu.com/daily',
    rssName: '百度知道日报',
    rssNum: 7, //7 per page
    rssRawEncode: 'GBK',

    rssAutoRefresh: true,
    rssRefreshTime: 60,

    //listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    postRemoveJ: '#daily-cont > img:last-child',
    listPostsLinksJ: '#body>div.banner-wp>div>a, #daily-list div.daily-cont-top>h2>a',
    
    postTitleJ: 'h1#daily-title',
    postContentsJ: `div#daily-cont`,
};


module.exports.zhidao_liuyan = {
    rssUrl: 'https://zhidao.baidu.com/liuyan/list',
    rssName: '百度知道 真相问答机',
    rssNum: 20, //20 per page
    rssRawEncode: 'GBK',

    rssAutoRefresh: true,
    rssRefreshTime: 60, 

    postRemoveJ: '#j-reasoning-detail-content > div > p:last-child',
    //listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: 'dl > dt > h3 > a',
    
    postTitleJ: 'p.question-title',
    postContentsJ: `#question-content, div.wgt-reasoning`,
};


module.exports.diaox2 = {
    rssUrl: 'https://www.diaox2.com/',
    rssName: '有调',
    rssNum: 24, //24 per page

    rssIsAjaxPage: true,

    rssAutoRefresh: true,
    rssRefreshTime: 30, 

    //listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a',
    listPostsLinksJ: '#content-list > li > a',
    
    postTitleJ: 'h1.article-title',
    postContentsJ: `div.article, .buy-box .method-source-and-price`,
};



////////////////////////////////////
// don't change the default settings
////////////////////////////////////

const settingDefault = {
    //main info
    rssUrl: 'http://www.iapps.im/tags/iPad/',
    rssName: 'iPad 限时免费 - iApps',
    rssDesc: 'rss by Moshel (http://hzy.pw/)',
    rssNum: 30,
    rssRawEncode: 'utf-8', 

    rssIsAjaxPage: false, //是否启用Ajax爬虫模式

    rssAutoRefresh: false, //定时自动刷新模式 or 被动获取模式(default)
    rssRefreshTime: 20, //min 自动模式下刷新间隔时间
    rssCacheTime: 5,    //min 被动模式下缓存时间

    //in posts list
    listNextPageJ: 'div.pagination-right > ul > li:nth-last-child(2) >a', //下一页选择器
    listPostsLinksJ: 'article div.entry-main > h2 > a', //列表中 `具体文章` 链接的选择器
    
    //in a post
    postTitleJ: 'h1',
    postRemoveJ: '', //要删除的节点的选择器
    postContentsAfter: '<p>RSS build by <a href="https://hzy.pw">Moshel</a>.</p>', //在RSS每篇文章末尾添加的内容
    postContentsJ: `article`, //文章内容选择器

    //仅被动模式需要设定时间识别
    postTimeJ: 'div.entry-main > div.entry-meta > div.entry-meta-first', //日期选择器
    postTimePraser: timeStr=>new Date(), //日期 文本->对象
};


// merge settings
for(let setName in module.exports) {
    for(let defKey in settingDefault)
        if(module.exports[setName][defKey]===undefined)
            module.exports[setName][defKey] = settingDefault[defKey];
}
