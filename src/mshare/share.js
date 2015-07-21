
var mqq = require('qqapi'),
    mshare = require('common/mshare'),
    appapi = require('qqapi/appapi');
    
function _appShareListener(opts, cb){
    if(opts.url.indexOf('?')>-1){
        opts.url = opts.url.replace(/\?(.*)#/, function(full, search){
            return '?' + search + '&_wv=3' + '#';
        });
    }else{
        opts.url += '?_wv=3';
    }
    appapi.addEventListener("evtClickShare", function (data) {
        typeof cb === 'function' && cb();
        appapi.invoke("edu", "showShareSelectDlg", {
            title: opts.title,
            summary: opts.summary,
            url: opts.url,
            coverImageUrl: opts.imgUrl,
            // app 分享加入机构快捷方式引入的bug
            agencyName: opts.agencyName || '',
            tencentUrl: opts.tencentUrl || ''
        });
    });
}
    
// 兼容手Q和课堂APP
module.exports = {
    init: function(){
        var opts = mshare.init();
        // app share
        opts.url = opts.link;
        opts.summary = opts.desc;
        opts.imgUrl = opts.img_url;
        _appShareListener(opts);
    }
}
