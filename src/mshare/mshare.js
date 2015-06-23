
;(function(root, factory){
	if(typeof define === 'function' && define.amd){
		define(factory);
	}else if(typeof module !== 'undefined' && module.exports){
		module.exports = factory();
	}else{
		root["mshare"] = factory();
	}
})(this, function(){

	/*
	* opts object {img_url: '', img_width: '', img_height: '', link: '', title: '', desc: ''}
	* cb function
	*/

	function WeixinShare(opts, cb){
		this.cfg = opts;
		this.init(cb);
	}

	WeixinShare.prototype = {
		constructor: WeixinShare,
		_shareTimeline: function(cb){
			var me = this;
			WeixinJSBridge.invoke('shareTimeline', me.cfg, function(res) {
				cb && typeof cb === 'function' && cb(res);
			});
		},
		_shareFriend: function(cb){
			var me = this;

			WeixinJSBridge.invoke('sendAppMessage', me.cfg, function(res) {
				cb && typeof cb === 'function' && cb(res);
			});
		},
		init: function(cb){
			var me = this;
			var _wxReady = function(){
				WeixinJSBridge.on('menu:share:timeline', function(){
					me._shareTimeline(cb);
				})
				WeixinJSBridge.on('menu:share:appmessage', function(){
					me._shareFriend(cb);
				})
			}

			/*
			* ios bug, WeixinJSBridge已经加载完成，下面的脚本后执行，导致坚挺的ready事件无效
			*/
			if(typeof window.WeixinJSBridge == 'undefined'){
				if(document.addEventListener){
					document.addEventListener("WeixinJSBridgeReady", _wxReady, false)
				}else if(document.attachEvent){
					document.attachEvent('WeixinJSBridgeReady', _wxReady);  
                    document.attachEvent('onWeixinJSBridgeReady', _wxReady);  
				}
			}else{
				_wxReady();
			}

		}
	}

	/*
	* opts object {oaUin:'公众帐号', share_url:'分享链接', title:'标题', image_url:'图片地址', desc: '详细描述'}
	*/
	function MqqShare(opts, cb){
		this.cfg = opts;
		this.init(cb);
	}

	MqqShare.prototype = {
		construct: MqqShare,
		_highVersion: function(cb){
			var me = this;
			mqq.ui.setOnShareHandler(function(type){
				// type //0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈
				me.cfg.share_type = type;
				cb && typeof cb === 'function' && cb(type);
				mqq.ui.shareMessage(me.cfg, function(data){
					if(data.result.retCode === 0){
						// share success						
					}
				});
			})
		},
		_lowerVersion: function(cb){
			var me = this;
			mqq.data.setShareInfo (me.cfg, function(){
				cb && typeof cb === 'function' && cb();
			});
		},
		init: function(cb){
			var me = this;
			if(mqq.compare("4.7.2") !== -1){
				me._highVersion(cb);
			}else if(mqq.compare("4.6") !== -1){
				me._lowerVersion(cb);
			}else{
				;
			}
		}	

	}

	function init(cfg, cb){
		var def_cfg = {},
			itemprop = document.querySelectorAll("meta[itemprop]"),
			item,
			maps = {"name": "title", "description": "desc", "image": "image_url"},
			opts = {},
			val,
			cfg = cfg || {};
		for(var i=0,len=itemprop.length;i<len;i++){
			item = itemprop[i];
			val = item.getAttribute("itemprop");
			maps[val] && (def_cfg[maps[val]] = item.getAttribute("content"));
		}

		def_cfg["img_url"] = def_cfg["image_url"];
		def_cfg["link"] = def_cfg["share_url"] = window.location.href;

		for(var key in def_cfg){
			opts[key] = cfg[key] || def_cfg[key];
		}
		new WeixinShare(opts, cb);
		new MqqShare(opts, cb);

	}

	return {
		init: init
	}
});