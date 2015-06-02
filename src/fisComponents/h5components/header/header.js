/*
 * header
 * 2015/06/02 by lqlongli
 * 用于所有H5页面，提供跳转到【腾讯课堂H5平台】的顶部栏
 *
 * 初始化
 * @report: [function(opts)] 用于数据上报方法，参数与tdw数据上报一样，默认是空函数
 * @jump: [function(url)] 用于跳转的方法, 默认是function(url) { window.location.href = url; }
 * @onItemClick: [function(src, where, btnElement)] 当顶部链接被点击时调用
 *      - src: 跳转链接
 *      - where: 跳转id，目前只有3个：'home', 'center', 'search'
 *      - btnElement：菜单元素
 *
 * window.commonNav.init({
 *      report: report.tdw
 * });
 *
 */

;(function(win, $) {
    var noop = function() {};
    var m = window.location.pathname.match(/^(.*)\.html$/), pageName = m?m[1]:'unknown';

    var $header;
    function bindEvents() {
        if (this.boundEvents) return;
        var that = this;
        $header.on('click', '.m-header__logo, .m-header__nav-link', function() {
            var $this = $(this), where = $this.data('jump'), src;

            $this.addClass('z-active');
            setTimeout(function() {
                $this.removeClass('z-active');
            }, 300);

            switch (where) {
                case 'home':
                    src = __uri('/index.html') + '?_bid=167&_wv=4097#from=' + pageName;
                    break;
                case 'center':
                    src = __uri('/center.html') + '?_bid=167&_wv=4097#from=' + pageName;
                    break;
                case 'search':
                    src = __uri('/courseList.html') + '?_bid=167&_wv=1025#search=1&from=' + pageName;
                    break;
            }
            that.onItemClick(src, where, $this);
            if (src) {
                that.jump(src);
            }
        });
        this.boundEvents = true;
    }

    function init(opts){
        this.opts = opts || {};
        $header = $('.m-header');

        if (opts.from) pageName = opts.from;
        this.report = opts.report || noop;
        this.jump = opts.jump || function(url) {
            window.location.href = url;
        }

        var that = this;
        this.onItemClick = this.opts.onItemClick || function(src, where, $btn) {
            var action, to;
            switch (where) {
                case 'home':
                    action = $btn.is('.m-header__logo') ? 'menu_logo_clk' : 'menu_home_clk';
                    to = 'index';
                    break;
                case 'center':
                    action = 'menu_individual_clk';
                    to = 'center';
                    break;
                case 'search':
                    action = 'menu_search_clk';
                    to = 'courseList';
                    break;
            }
            that.report({
                local: true,
                module: 'Y-MQ-menu',
                action: action,
                obj1: pageName,
                obj2: to
            });
        };

        bindEvents.apply(this);
    }

    var commonHeaderForH5 = {
        init: init
    };

    //seajs & requirejs
    if (typeof define === 'function') {
        define("commonHeaderForH5", [], function() {
            return commonHeaderForH5;
        });
    };

    win.commonHeaderForH5 = commonHeaderForH5;
})(window, window.$);