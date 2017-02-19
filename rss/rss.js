const RSS = require('rss'),
      cheerio = require('cheerio');

const cacheBox = require('../my_modules/cache_box'),
      {reqPromise} = require('../my_modules/request');


/////////

module.exports.makeRss = function* makeRss() {
    const setting = this;

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
        let indexHtml = yield reqPromise(nowUrl);
        let $ = cheerio.load(indexHtml);

        nowUrl = $(setting.listNextPageJ).attr('href');

        let postsLinks = $(setting.listPostsLinksJ).map(function() {
            return $(this).attr('href');
        });


        //parallel request posts
        let postsRequests = [];
        for(let i=0; i<postsLinks.length; i++) {
            if(numPostsAdded++ >= setting.rssNum) break;

            let cache = cacheBox.get('rssPost_'+postsLinks[i]);
            if(cache.err) {
                postsLinksUnfired.push(postsLinks[i]);
                postsRequests.push( reqPromise(postsLinks[i]) );
            }
            else
                postsCacheFired.push(cache.value);
        }
        let postsRet = yield postsRequests;

        postsContents = postsContents.concat(postsRet);
        numPostsAdded += postsRet.length;
    }


    //parse postsCacheFired
    for(let postData of postsCacheFired) 
        feed.item(postData);

    //parse postsContents
    for(let i=0; postsContents.length>i; i++) {
        let $ = cheerio.load(postsContents[i]);
        
        let postTitle = $(setting.postTitleJ).text();

        let postContents = $(setting.postContentsJ);
        postContents.find('*').each((i, dom)=>{
            $(dom).removeAttr('id').removeAttr('class');
        });
        postContents = postContents.html();

        let postTime = $(setting.postTimeJ).text();
        postTime = setting.postTimePraser(postTime);

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
    return feed.xml({indent: false});
}

