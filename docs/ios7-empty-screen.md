IOS7白屏Bug
=================
产生原因：IOS7中，如果html header 返回了cache-control:max-age=0(或者no-cache)，这个时候Browser不会cache页面，但浏览器每次请求都会携带请求头（If-Modified-Since或者If-None-Match）。如果此时服务器刚好没有修改的话，会识别成304给Browser，此时前面已提到过Browser没有缓存页面内容，导致取不到页面而白屏。详细Bug描述猛戳[这里](http://tech.vg.no/2013/10/02/ios7-bug-shows-white-page-when-getting-304-not-modified-from-server/)。

============
解决办法
============
+      **设置cache时间（诸如：cache-control：max-age=600）：**
         对于首页更新要求来讲，如果有cache的话，不利于首页及时更新，对于更新场景不多的情况，可以采取这个办法
+      **去掉cache-control字段头(我们采取这个方案)**
+      **服务器动态处理：**
        当然对于以上的方案都是基于IOS7，服务器根据请求的Header头中的User-agent来单独针对IOS7及以上处理
