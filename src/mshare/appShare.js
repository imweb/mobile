// app 分享
function _appShareListener(opts, cb){
        // 统一处理，在分享中带上_wv参数，分享到手Q，隐藏底部导航
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
        })；
    });
}
