# APIs by h2y

这个仓库是一个单独的 Node 应用，基于 [restify](http://restify.com/) 开发，运行后可提供多个 API 的服务。每个文件夹实现一个 API 功能。

该项目已运行于我的服务器 <https://api.hzy.pw/> 中，大家可以直接调用，无任何限制。同时也可以下载源码，将这组 API 运行在自己的服务器中。

## /saying

**[] 随机名人名言 []**

每次访问返回一条随机的名人名言，提供 3 个 API 接口，分别返回来自 _一个、金山词霸、有道_ 三个网站中采集的名言。

词霸和有道接口返回的名言是中英文对照的，很高大上。

返回内容涵盖了能采集到的所有信息，包括名言的配图，所以也可以作为 **随机图片获取接口** 来使用。

### 请求

> GET: <http://api.hzy.pw/saying/v1/one>

返回来自 _ONE·一个_ 的名言

> GET: <http://api.hzy.pw/saying/v1/ciba>

返回来自 _金山词霸每日一句_ 的名言

> GET: <http://api.hzy.pw/saying/v1/youdao>

返回来自 _有道每日一句_ 的名言

### 示例

> GET: <http://api.hzy.pw/saying/v1/ciba>

```json
{
    "cn": "你可以拥有一切，只是不能一次就全到手。(Oprah Winfrey)",
    "cnFix": "你可以拥有一切，只是不能一次就全到手。",
    "en": "You can have it all. You just can't have it all at once.",
    "date": "2015-05-24",
    "pic": "http://cdn.iciba.com/news/word/big_2015-05-24b.jpg",
    "picSmall": "http://cdn.iciba.com/news/word/2015-05-24.jpg",
    "picSquare": "http://cdn.iciba.com/news/word/xiaomi_2015-05-24mi.jpg",
    "link": "http://www.iciba.com/dailysentence/1299",
    "linkPC": "http://news.iciba.com/views/dailysentence/daily.html#!/detail/sid/1299"
}
```

### 返回

不用说了，返回结果很清晰易懂不是？

**注意事项：**由于可采集到的内容不同，每个接口返回的内容结构并不完全一致。比如 one 接口不会返回 `en` 键。
