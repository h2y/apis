const URL = require('url');

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
        let postsLinks = $(setting.listPostsLinksJ).map(function() {
            let link = $(this).attr('href');
            link = URL.resolve(nowUrl, link);
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
        
        let postTitle = $(setting.postTitleJ).text().trim();

        let postTime = $(setting.postTimeJ).text();
        postTime = setting.postTimePraser(postTime);

        //get contents 
        let $contents = $(setting.postContentsJ),
            postContents = '';
            
        //remove doms
        $contents.find('noscript, style, script').remove();
        $contents.find(setting.postRemoveJ).remove();
        
        //img links fix
        $contents.find('img').each((i2, dom)=>{
            let $dom = $(dom),
                src = $dom.attr('src');
            let newSrc = URL.resolve(postsLinksUnfired[i], src);
            if(newSrc!=src)
                $dom.attr('src', newSrc);
        });
        
        //remove id & class
        $contents.find('*').each((i, dom)=>{
            $(dom).removeAttr('id').removeAttr('class');
        });
        
        postContents += $.html($contents).trim() + setting.postContentsAfter;
        
        let postData = {
            title: postTitle,
            url:   postsLinksUnfired[i],
            date:  postTime,
            description: postContents,
        };
        
        feed.item(postData);
        
        cacheBox.set('rssPost_'+postsLinksUnfired[i], postData, 24*60*60*1000); //1h
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
