# APIs by h2y

这个仓库是一个单独的 Node 应用，基于 [restify](http://restify.com/) 开发，运行后可提供多个 API 的服务。每个文件夹实现一个 API 功能。

该项目已运行于我的服务器 <https://api.hzy.pw/> 中，大家可以直接调用，无任何限制。不过我不保证稳定性，所以更推荐大家下载源码，将这组 API 运行在自己的服务器中。

## /avatar

**[] 随机 SVG 矢量图形 []**

![](https://camo.githubusercontent.com/b42d9837352ca7e294639ff1cc95f1e6798d85c3/68747470733a2f2f6a64656e7469636f6e2e636f6d2f686f737465642f6769746875622d73616d706c65732e706e67)

生成矢量风格的图片，传入两个参数：尺寸和 Hash 值，输出一个 SVG 图片，**并且保证对传入相同的 Hash 时返回的头像是相同的。**

可以用在任何用户系统中，当用户没有上传头像时，可根据 userID 生成一个独一无二的头像，而不是所有人都显示一个默认头像。

### 请求

> GET: <https://api.hzy.pw/avatar/v1/150/key>

返回 hash 值为 `key` 并且尺寸为 `150px*150px` 的矢量图形。

> GET: <https://api.hzy.pw/avatar/v1/70/>

返回尺寸为 `70px*70px` 的随机矢量图形。（每次请求的返回均不相同）

### 前端显示

返回类型为 SVG，所以不能使用 `<img>`，请使用 `<embed>` 标签插入到前端页面中：

`<embed src="https://api.hzy.pw/avatar/v1/99/key" width="99" height="99" type="image/svg+xml" />`


## /saying

**[] 随机名人名言 []**

每次访问返回一条随机的名人名言，提供 3 个 API 接口，分别返回来自 _一个、金山词霸_ 两个网站中采集的名言。其中词霸接口返回的名言是中英文对照的，很高大上。

返回内容涵盖了能采集到的所有信息，包括名言的配图，所以也可以作为 **随机图片获取接口** 来使用。

### 请求

> GET: <https://api.hzy.pw/saying/v1/one>

返回来自 _ONE·一个_ 的名言

> GET: <https://api.hzy.pw/saying/v1/ciba>

返回来自 _金山词霸每日一句_ 的名言

### 示例

> GET: <https://api.hzy.pw/saying/v1/ciba>

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

**注意事项：**由于可采集到的内容不同，每个接口返回的内容结构并不完全一致。比如 one 接口不会返回 `en` 键。


## /rss_maker

**[] 任意网站 RSS 生成器 []**

为任意网站生成 RSS 链接，这并不是一个 REST API，归类为一个使用 Node 开发的服务器程序更为合适，放在这里是为了我的部署方便。

详情请点击：<https://github.com/h2y/apis/blob/master/rss_maker/README.md>
