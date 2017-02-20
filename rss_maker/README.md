# RSS Maker

将感兴趣网站的 RSS 记录下来，在阅读器中同一阅读是最棒的阅读体验，不过现在的很多网站并不提供 RSS 地址，强制我们上他们的网站甚至是下载其 App，很无理。于是，我开发了 _RSS Maker_，为所有的网站生成 RSS 地址。

本项目的诞生来自我的灵感仓库 [#12](https://github.com/h2y/inspirations/issues/12)

## 关于 Git 仓库

没有新开一个 Git 仓库是因为 apis 和 _RSS Maker_ 都是使用 Node 开发，而前者也是一个响应 web 请求的程序，并部署在了我的服务器中。所以我就把 _RSS Maker_ 作为一个子功能添加到了其中。

其实严格来看，_RSS Maker_ 并不是一个 WEB API 服务。

## 当前 RSS 

为满足我的个人需要，我目前运行着以下几个网站的 RSS 生成服务，分享给大家一起使用：

### [iApps iPad 限时免费](http://www.iapps.im/tags/iPad/)

RSS: <https://api.hzy.pw/rss/v1/iapps_ipad>

### [百度知道日报](https://zhidao.baidu.com/daily)

RSS: <https://api.hzy.pw/rss/v1/zhidao_daily>

### [百度知道 真相问答机](https://zhidao.baidu.com/liuyan/list)

RSS: <https://api.hzy.pw/rss/v1/zhidao_liuyan>

> **特别说明**

> 不保证上述列表实时更新，但格式均为：`https://api.hzy.pw/rss/v1/‘TASKNAME’`

> 所以大家可以在 [settings.js](https://github.com/h2y/apis/blob/master/rss_maker/settings.js) 中找到目前我运行在服务器中的所有 RSS 地址。


## 特点

1. 使用 CSS 选择器来获取页面中的标题、日期等内容，适用性极广。
2. 先扫描 ‘文章列表’ 页面，得到文章链接，再进入 ‘具体文章’ 页面，获取文章具体信息。
3. 两种刷新逻辑：有请求才采集（被动）、定时采集（主动）
4. RSS 文件支持缓存时间设定。
5. ‘具体文章’ 会页面无限缓存，‘文章列表’ 页面不会缓存。
6. 两种采集模式：静态页面请求、<del>动态页面请求</del>（待开发）

## 项目运行方法

需要下载整个 apis 项目，并运行 apis/index.js 文件。

该程序由配置文件驱动，按照注释编辑 `setting.js` 文件，即可为你所需要的任何网站提供 RSS 支持。
