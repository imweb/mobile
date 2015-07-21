

/*
*  分享处理，这里默认会读取页面的itemprop属性，生成分享内容
 */
function wxShare(opts, cb){

    function _wxReady(){
        WeixinJSBridge.on('menu:share:timeline', function(){
            WeixinJSBridge.invoke('shareTimeline', opts, function(res) { 
                typeof cb === 'function' && cb(res);
            });
        })
        WeixinJSBridge.on('menu:share:appmessage', function(){
            WeixinJSBridge.invoke('sendAppMessage', opts, function(res) {
                typeof cb === 'function' && cb(res);
            });
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

/*
* opts {object} detail info: {oaUin:'公众帐号', share_url:'分享链接', title:'标题', image_url:'图片地址', desc: '详细描述'}
* cb {function} call back
* mqq share
*/

function mqqShare(opts, cb){
    if(!window.mqq || !mqq.compare) return;

    if(mqq.compare("4.7.2") !== -1){
        mqq.ui.setOnShareHandler(function(type){
            // type //0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈
            opts.share_type = type;
            typeof cb === 'function' && cb(type);
            mqq.ui.shareMessage(opts, function(data){});
        })
    }else if(mqq.compare("4.6") !== -1){
        mqq.data.setShareInfo (opts, function(){
            typeof cb === 'function' && cb();
        });
    }else{
        ;
    }
}


// main interface, hanlder param and init 
function init(cfg, cb){
    // default config
    var href = location.href;
    var def_cfg = {
        share_url: href,
        link: href,
        img_url: "",
        image_url: "",
        title: "",
        desc: ""
    },
        itemprop = document.querySelectorAll("meta[itemprop]"),
        item,
        maps = {"name": "title", "description": "desc", "image": "image_url"},
        opts = {},
        mapVal,
        cfg = cfg || {};

    // get itemprop info
    for(var i=0,len=itemprop.length;i<len;i++){
        item = itemprop[i];
        mapVal = maps[item.getAttribute("itemprop")]
        mapVal && (def_cfg[mapVal] = item.getAttribute("content"));
    }

    def_cfg["img_url"] = def_cfg["image_url"];

    // rewrite default config
    for(var key in def_cfg){
        opts[key] = cfg[key] || def_cfg[key];
    }

    mqqShare(opts, cb);
    wxShare(opts, cb);
    return opts;

}


module.exports = {
    init: init
}
