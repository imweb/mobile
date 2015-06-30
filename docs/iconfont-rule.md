#icon font规范


## 设计svg标准

由设计补充

## icon font使用标准

1、 可根据自身业务的及所兼容的浏览器特点，去掉不需要的字体，字体兼容可参考[@font-face](http://css3files.com/font/)

2、 所有字体放在'css/fonts'目录，布置线上环境时请注意同源策略，解决办法为`Access-Control-Allow-Origin *`

3、 需新建一个基础scss文件，如`_icon-font.scss`放置icon font样式。

4、 考虑到非全新项目，且区别于其他图片icon或css绘制的icon，class统一采用`.icon-font.i-iconname`的形式。如search图标的class为`.icon-font.i-search`

5、 公有样式放在class`.icon-font`中，默认字体大小为16px，行高为1倍

	.icon-font {
		font-family: 'webfont';
		speak: none;
		font-style: normal;
		font-weight: normal;
		font-variant: normal;
		text-transform: none;
		line-height: 1;
		font-size: 16px;
		position: relative;
		vertical-align: -2px;
	
		/* Better Font Rendering =========== */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

6、 统一使用伪元素before或after来生成内容，如：

	.i-search:before {
		content: "\e617";
	}

7、 不同的颜色，大小或位置控制可通过父级元素来控制

	.search-block{
		.i-search{
			color: #fff;
			font-size: 32px;	
		}
	}

8、 可以使用vertical-align或绝对定位对齐文字，默认使用vertical-align

9、 应该提供一个预览所有icon的地址，如平台的可放在'ui/icon-font'


注：在没有搭建好工具之前，我们可以采用线上的[icomoon](http://icomoon.io)上传svg生成字体，或者采用'grunt-webfont'插件生成字体
