/*
 * share 分享组件，现继承手Q分享和微信内嵌页分享
 * 2014/12/30 by lqlongli
 *
 * @ref: [MQQ JS API](http://mqq.oa.com/api/index.html)
 * @ref: [微信WebView常用JS API介绍](http://km.oa.com/group/700/articles/show/172714)
 *
 * 初始化
 * @flag: 初始化组件标识位，目前有share.FLAG_MQQ和share.FLAG_WEIXIN两个，可组合
 * @title: 分享标题，默认是'腾讯课堂'，会被<meta itemprop="name" content="..."/>覆盖
 * @desc: 分享描述，默认是'海量精品课，限时免费，赶快来学吧！'，会被<meta itemprop="description" content="..."/>覆盖
 * @image: 分享图片链接，默认是在线教育logo，会被<meta itemprop="image" content="..."/>覆盖
 * @url: 分享链接，默认是当前页面链接
 * @beforeMQQShare: function，在MQQ分享之前调用，可以修改分享内容
 *  - args:
 *      - shareParams: 分享内容对象
 *  - return:
 *      - shareParams: 修改之后的分享内容对象
 * @onMQQShareBtnClick: function，在MQQ分享面板中点击了分享类型之后回调
 *  - args:
 *      - type: 用户点击的分享类型，0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈
 *  - return: none
 * @onMQQShare: function，MQQ分享回调，注：IOS不支持回调，分享微信好友和朋友圈不支持回调
 *  - args: （注：4.6版本以下无参数）
 *      - result: MQQ分享结果
 *          - retCode: 0：用户点击发送，完成整个分享流程；1：用户点击取消，中断分享流程
 *      - type: 用户点击的分享类型，0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈
 *  - return: none
 *
 * @beforeWeiXinShare: function，在微信分享之前调用，可以修改分享内容
 *  - args:
 *      - shareParams: 分享内容对象
 *  - return:
 *      - shareParams: 修改之后的分享内容对象
 * @onShareWeiXinFriend: function，微信分享好友回调
 *  - args:
 *      - res: 分享结果
 *          - err_msg: send_app_msg:cancel 用户取消
 *                     send_app_msg:ok 分享成功
 *                     fail: 分享失败
 *  - return: none
 * @onShareWeiXinTimeline: function，微信分享朋友圈回调
 *  - args:
 *      - res: 分享结果
 *          - err_msg: share_timeline:cancel 用户取消，注：检测用户取消动作只有IOS支持
 *                     share_timeline:ok 分享成功
 *                     fail: 分享失败
 *  - return: none
 *
 * share.init({
 *      flag: share.FLAG_MQQ+share.FLAG_WEIXIN
 * });
 *
 * MQQ分享消息
 * @opts: 同init参数
 * @type: 分享类型，0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈
 * @cb: 4.7.2版本以下不支持此分享，这时会调用cb
 * share.MQQShareMessage(opts, type, cb);
 *
 * 展示MQQ分享面板
 * @opts: 同init参数
 *  -onMQQShowShareMenu: function，面板展示之后回调
 * @cb: 5.2版本以下不支持此分享，这时会调用cb
 * share.MQQShowShareMenu(opts, cb);
 *
 * 微信分享好友
 * @opts: 同init参数
 * share.WeiXinShareToFriend(opts);
 *
 * 微信分享朋友圈
 * @opts: 同init参数
 * share.WeiXinShareToTimeline(opts);
 *
 * 静态扩展，永久可用：
 * 1. 在OP内添加分享组件的初始化代码，key为位数值，从低到高，如1，2，4，8，value为function(opts)
 * 2. 在share内添加flag常量供用户使用
 *
 * 动态扩展，页面内可用，同静态扩展，只是用程序来实现上面两个步骤
 * 1. share.OP[4] = function(opts) { ... };
 * 2. share.FLAG_XXX = 4;
 */

var $ = require('zepto'), defaultOpt = {
	title: '腾讯课堂',
	desc: '海量精品课，限时免费，赶快来学吧！',
	url: window.location.href,
	image: __uri('../../img/logo-edu-72.png')
}, MAP = {"name": "title", "description": "desc", "image": "image"};

var OP = {
	getMQQParams: function(o) {
		return {
			oaUin: '2029033910',
			title: o.title,
			desc: o.desc,
			share_url: o.url,
			image_url: o.image
		};
	},
	getWeiXinParams: function(o) {
		return {
			img_url: o.image,
			link: o.url,
			desc: o.desc,
			title: o.title
		};
	},
	WeiXinShareToFriend: function(opts) {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			var shareParams = this.getWeiXinParams($.extend({}, defaultOpt, opts));
			opts.beforeWeiXinShare && (shareParams = opts.beforeWeiXinShare(shareParams));
			WeixinJSBridge.invoke("sendAppMessage", shareParams, function (res) {
				opts.onShareWeiXinFriend && opts.onShareWeiXinFriend(res);
			});
		}
	},
	WeiXinShareToTimeline: function(opts) {
		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			var shareParams = this.getWeiXinParams($.extend({}, defaultOpt, opts));
			//朋友圈默认不现实desc，需要fix
			shareParams.title = shareParams.desc;
			opts.beforeWeiXinShare && (shareParams = opts.beforeWeiXinShare(shareParams));
			WeixinJSBridge.invoke("shareTimeline", shareParams, function (res) {
				opts.onShareWeiXinTimeline && opts.onShareWeiXinTimeline(res);
			});
		}
	},
	1: function(opts) {     //MQQ分享初始化
		var that = this;
		require.async('qqapi', function (mqq) {
			if (T.isValidMQQ(mqq)) {
				var o = $.extend({}, defaultOpt, opts);
				if(mqq.compare("4.7.2") !== -1){
					var shareParams = that.getMQQParams(o);
					o.beforeMQQShare && (shareParams = o.beforeMQQShare(shareParams));
					//fix 微信朋友圈
					var shareParams2 = $.extend({}, shareParams);
					shareParams2.title = shareParams2.desc;
					mqq.ui.setOnShareHandler(function (type) {
						//type: 0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈。默认为 0
						o.onMQQShareBtnClick && o.onMQQShareBtnClick(type);
						mqq.ui.shareMessage($.extend({}, type==3?shareParams2:shareParams, {share_type: type}), function (result) {
							//result.retCode: 0: 完成 1: 取消
							o.onMQQShare && o.onMQQShare(result, type);
						});
					});
				}else if(mqq.compare("4.6") !== -1){
					var shareParams = that.getMQQParams(o);
					o.beforeMQQShare && (shareParams = o.beforeMQQShare(shareParams));
					mqq.data.setShareInfo(shareParams, function() {
						o.onMQQShare && o.onMQQShare(); //IOS不支持此回调
					});
				}else{
					//用户版本太低，我没办法了...
				}
			}
		});
	},
	2: function(opts) {     //微信分享初始化分享
		var that = this;
		function init(){
			WeixinJSBridge.on("menu:share:appmessage", function() {
				that.WeiXinShareToFriend.call(that, opts)
			});
			WeixinJSBridge.on("menu:share:timeline", function() {
				that.WeiXinShareToTimeline.call(that, opts);
			});
		}

		if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
			init();
		} else {
			if (document.addEventListener) {
				document.addEventListener("WeixinJSBridgeReady", init, false);
			} else if (document.attachEvent) {
				document.attachEvent("WeixinJSBridgeReady", init);
				document.attachEvent("onWeixinJSBridgeReady", init);
			}
		}
	}
	//新增分享类型时，可以在下面添加初始化方法，标号按顺序用位标号，下一位是4
};

var share = {
	FLAG_MQQ: 1,
	FLAG_WEIXIN: 2,
	//新增分享类型时，可以在下面标号，标号按顺序用位标号，下一位是4
	initDefaultOpt: function() {
		var itemprops = document.querySelectorAll("meta[itemprop]"),
			item, key, value;

		for(var i = 0, len = itemprops.length; i < len; ++i){
			item = itemprops[i];
			key = item.getAttribute("itemprop");
			value = item.getAttribute("content");
			MAP[key] && (defaultOpt[MAP[key]] = value);
		}
	},
	init: function(opts) {  //幂等函数
		if (!this.__init__) this.initDefaultOpt();
		this.opts = $.extend({}, opts);
		var i = this.FLAG_MQQ;
		while(OP[i]) {
			if (this.opts.flag & i) {
				OP[i](this.opts);
			}
			i = i << 1;
		}
		this.__init__ = true;
	},
	MQQShareMessage: function(o, type, cb) {
		if (!this.__init__) return;
		require.async('qqapi', function (mqq) {
			if (T.isValidMQQ(mqq)) {
				if(mqq.compare("4.7.2") !== -1){
					var shareParams = this.OP.getMQQParams(o);
					o.beforeMQQShare && (shareParams = o.beforeMQQShare(shareParams));
					//fix 微信朋友圈
					var shareParams2 = $.extend({}, shareParams);
					shareParams2.title = shareParams2.desc;
					mqq.ui.shareMessage($.extend(type==3?shareParams2:shareParams, {share_type: type}), function (result) {
						//result.retCode: 0: 完成 1: 取消
						o.onMQQShare && o.onMQQShare(result, type);
					});
				} else {
					cb && cb();
				}
			}
		});
	},
	MQQShowShareMenu: function(o, cb) {
		require.async('qqapi', function (mqq) {
			if (T.isValidMQQ(mqq)) {
				if(mqq.compare("5.2") !== -1){
					mqq.ui.showShareMenu();
					o.onMQQShowShareMenu && o.onMQQShowShareMenu();
				} else {
					cb && cb();
				}
			}
		});
	},
	WeiXinShareToFriend: function(opts) {
		this.OP.WeiXinShareToFriend(opts);
	},
	WeiXinShareToTimeline: function(opts) {
		this.OP.WeiXinShareToTimeline(opts);
	}
};
//应该把OP附到share中，让用户可修改任何东西
share.OP = OP;

module.exports = share;