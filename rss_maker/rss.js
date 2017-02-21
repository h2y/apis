const RSS = require('rss'),
      cheerio = require('cheerio');

const cacheBox = require('../my_modules/cache_box'),
      {reqPromise} = require('../my_modules/request');


/////////

module.exports.makeRss = function* makeRss() {
    const setting  = this.setting,
          taskName = this.taskName;

    const feed = new RSS({
        title: setting.rssName,
        description: setting.rssDesc,
        generator: 'http://hzy.pw',
        feed_url: '',
        site_url: setting.rssUrl
    });


    //request tasks
    let postsContents = [],
        postsLinksUnfired = [],
        postsCacheFired = [];

    for(let numPostsAdded=0, nowUrl=setting.rssUrl; numPostsAdded<setting.rssNum;) {
        let indexHtml = yield reqPromise(nowUrl, setting.rssRawEncode, setting.rssIsAjaxPage);

        let $ = cheerio.load(indexHtml);

        //get all posts links
        const url = require('url');
        let postsLinks = $(setting.listPostsLinksJ).map(function() {
            let link = $(this).attr('href');
            link = url.resolve(nowUrl, link);
            return link;
        });

        //parallel request posts
        let postsRequests = [];
        for(let i=0; i<postsLinks.length; i++) {
            if(numPostsAdded++ >= setting.rssNum) break;

            let cache = cacheBox.get('rssPost_'+postsLinks[i]);
            if(cache.err) {
                postsLinksUnfired.push(postsLinks[i]);
                postsRequests.push( reqPromise(postsLinks[i], setting.rssRawEncode, setting.rssIsAjaxPage) );
            }
            else
                postsCacheFired.push(cache.value);
        }
        let postsRet = yield postsRequests;

        postsContents = postsContents.concat(postsRet);
        numPostsAdded += postsRet.length;

        //next page
        nowUrl = $(setting.listNextPageJ).attr('href');
    }


    //parse postsCacheFired
    for(let postData of postsCacheFired) 
        feed.item(postData);

    //parse postsContents
    for(let i=0; postsContents.length>i; i++) {
        let $ = cheerio.load(postsContents[i]);
        
        $('noscript, style, script').remove();
        $(setting.postRemoveJ).remove();

        let postTitle = $(setting.postTitleJ).text();

        let postTime = $(setting.postTimeJ).text();
        postTime = setting.postTimePraser(postTime);

        //finnal is the contents 
        let $contents = $(setting.postContentsJ),
            postContents = '';
        $contents.find('*').each((i, dom)=>{
            $(dom).removeAttr('id').removeAttr('class');
        });
        postContents += $.html($contents) + setting.postContentsAfter;

        let postData = {
            title: postTitle,
            url:   postsLinksUnfired[i],
            date:  postTime,
            description: postContents,
        };

        feed.item(postData);

        cacheBox.set('rssPost_'+postsLinksUnfired[i], postData, 999999999);
    }


    //done
    const xmlOut = feed.xml({indent: false});

    let cacheTime = setting.rssCacheTime;
    if(setting.rssAutoRefresh)
        cacheTime = setting.rssRefreshTime + .2;
    cacheTime *= 60*1000;

    cacheBox.set('rssXML_'+taskName, xmlOut, cacheTime);
    return xmlOut;
}


