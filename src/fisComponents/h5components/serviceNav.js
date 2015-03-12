/*
 * menuList
 * 2015/02/12 by lqlongli
 * 用于所有H5页面，提供跳转到【腾讯课堂H5平台】的菜单
 * 在手Q环境下，菜单btn在右上角，利用mqq接口定制webview的顶部栏按钮
 * 在非手Q环境下，菜单btn浮在页面右下角
 *
 * 初始化
 * @report: [function|all] 用于数据上报方法，参数与tdw数据上报一样，默认是空函数
 * @jump: [function(url)|all] 用于跳转的方法, 默认是function(url) { window.location.href = url; }
 * @clickEventType: [string|all] 点击事件类型，默认是'tap'
 * @onBtnInit: [function|all] 菜单按钮初始化完成时调用
 * @onBtnClick: [function|all] 菜单按钮被点击时调用
 * @onItemClick: [function(src, btnElement)|all] 当菜单被点击时调用，参数src: 菜单跳转地址，分享则为'share'；btnElement：菜单元素
 *
 * @shareParams: [object|mqq] 分享参数，如果传入此参数，则在手Q环境下会出现分享按钮
 *      @title: 分享标题
 *      @desc: 分享内容
 *      @image_url: 分享图片链接
 *      @share_url: 分享链接
 * @scrollParent: [object|mqq] 滚动元素，监听touchmove事件，收起右上角菜单
 * @onShareHide: [function|mqq] 当分享菜单按钮隐藏时调用，两种情况：1. 没有shareParams参数 2. mqq版本不支持
 * @onShareBtnClick: [function(type)|mqq] 当分享按钮被点击时调用，参数为分享类型type：0：QQ好友；1：QQ空间；2：微信好友；3：微信朋友圈。默认为 0
 * @onShare: [function(type, result)|mqq] 当分享结束时调用，参数result.retCode: 0：用户点击发送，完成整个分享流程；1：用户点击取消，中断分享流程
 * @onShareMenuOpen: [function|mqq] 当分享面板弹出时调用
 * @onShareClick: [function|mqq] 当分享菜单按钮被点击时调用
 *
 * @actions: [array|nonmqq] 非手Q环境下的菜单配置项，一般不设置，格式看源代码
 * @r: [number|nonmqq] 非手Q环境下的菜单项圆弧半径，一般不设置
 * @defaultStyle: [string|nonmqq] 非手Q环境下菜单项的默认样式，默认为'left:0;top:0;'，一般不设置
 * @cb: [function(action, btnElement)|nonmqq] 非手Q环境下，菜单项点击之后，如果该菜单不是跳转动作的话，则调用此回调来处理
 *                                            参数action是菜单项对应的action配置；btnElement：菜单元素，默认为空函数
 *
 * window.commonNav.init({
 *      report: report.tdw
 * });
 *
 * 展开
 * window.commonNav.show();
 *
 * 收起
 * window.commonNav.hide();
 *
 * 切换
 * window.commonNav.toggle();
 *
 */

;(function(win) {
    var $, noop = function() {};
    var m = window.location.pathname.match(/^(.*)\.html$/), pageName = m?m[1]:'unknown';

    function isMQQ() {
        return win.mqq && parseInt(win.mqq.QQVersion) != 0;
    }
    function importStyle(css, id) {
        var ele = document.createElement('style');
        ele.id = id;
        document.getElementsByTagName('head')[0].appendChild(ele);
        if (ele.styleSheet) {
            ele.styleSheet.cssText = css;
        } else {
            ele.appendChild(document.createTextNode(css));
        }
    }

    var menuList = (function() {
        var tpl = '<ul class="menu-list">' +
                '<li class="menu-list__item" data-src="http://ke.qq.com/mobilev2/index.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--home"></span>首页</li>' +
                '<li class="menu-list__item border-top" data-src="http://ke.qq.com/mobilev2/courseList.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--search"></span>找课</li>' +
                '<li class="menu-list__item border-top" data-src="http://ke.qq.com/mobilev2/courseSchedule.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--schedule"></span>课程表</li>' +
                '<li class="menu-list__item border-top" data-src="http://ke.qq.com/mobilev2/myLearned.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--record"></span>学习记录</li>' +
                '<li class="menu-list__item border-top" data-src="http://ke.qq.com/mobilev2/myFav.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--fav"></span>我的收藏</li>' +
                '<li class="menu-list__item border-top" data-src="http://ke.qq.com/mobilev2/courseManagement.html?_bid=167&_wv=3#from=' + encodeURIComponent(pageName) + '"><span class="menu-list__icon menu-list__icon--management"></span>管理</li>' +
                '<li class="menu-list__item border-top j-share" data-op="share"><span class="menu-list__icon menu-list__icon--share"></span>分享</li>' +
                '</ul>',
            cssStr = ".menu-list{position:fixed;top:0;right:0;z-index:10100;background-color:#fff;overflow:hidden;box-shadow:-2px 2px 1px 1px rgba(0,0,0,.1);display:none}.menu-list.z-open{display:block}.animation .menu-list{-webkit-transform:translate3d(0,-101%,0);-webkit-transition:-webkit-transform .2s ease}.animation .menu-list.z-open{-webkit-transform:translate3d(0,0,0)}.menu-list__item{font-size:14px;color:#333;height:44px;line-height:44px;padding-left:15px;width:125px;display:-webkit-box;-webkit-box-align:center}.menu-list__item.z-active{background-color:#e5e5e5}.menu-list__icon{display:block;vertical-align:middle;width:23px;height:23px;background:url("+__uri("../img/sprites-menulist@2x.png")+") no-repeat 0 0;background-size:23px auto;margin-right:15px}.menu-list__icon--schedule{background-position:0 -50px}.menu-list__icon--record{background-position:0 -75px}.menu-list__icon--fav{background-position:0 -100px}.menu-list__icon--management{background-position:0 -125px}.menu-list__icon--share{background-position:0 -150px}.menu-list__icon--search{background-position:0 -25px}#menu-list-btn{position:absolute;top:20px;right:20px;z-index:100;width:44px;height:44px;border-radius:22px;background-color:rgba(0,0,0,.8)}#menu-list-btn .icon-menu-btn{display:block;width:22px;height:17px;margin:13px 0 0 11px;background:url("+__uri("../img/sprites-menulist@2x.png")+") no-repeat 0 -175px;background-size:23px auto}";

        function build() {
            importStyle(cssStr, 'css-menuList');
            var that = this;
            this.$list = $(tpl).appendTo(document.body).on((this.opts.clickEventType || 'tap'), '.menu-list__item', function() {
                var $this = $(this), src = $this.data('src'), op;
                $this.addClass('z-active');
                setTimeout(function() {
                    $this.removeClass('z-active');
                    hide.call(that);
                }, 300);
                if (src) {
                    that.onItemClick(src, $this);
                    that.jump(src);
                } else {
                    op = $this.data('op');
                    if (op) {
                        that.onItemClick(op, $this);
                    }
                }
            });
            this.$share = this.$list.find('.j-share');
            if (this.opts.shareParams) {
                setTimeout(function() {
                    if (isMQQ()) {
                        if (win.mqq.compare('4.7') == -1) {
                            that.$share.hide();
                            that.onShareHide();
                            return;
                        }
                        win.mqq.data.setShareInfo(that.opts.shareParams);
                        if (win.mqq.compare('5.2') >= 0) {
                            win.mqq.ui.setOnShareHandler(function (type) {
                                that.onShareBtnClick(type);
                                win.mqq.ui.shareMessage($.extend({}, that.opts.shareParams, {share_type: type}), function (result) {
                                    that.onShare(type, result);
                                });
                            });
                        }
                        that.$share.on((that.opts.clickEventType || 'tap'), function (e) {
                            if (win.mqq.compare('5.2') == -1) {
                                win.mqq.ui.shareMessage(that.opts.shareParams, function (result) {
                                    that.onShare(0, result);
                                });
                            } else {
                                win.mqq.ui.showShareMenu();
                                that.onShareMenuOpen();
                            }
                            that.onShareClick();
                        });
                    } else {
                        that.$share.hide();
                        that.onShareHide();
                    }
                }, 0);
            } else {
                this.$share.hide();
            }
            bindEvents.call(this);
        }
        function bindEvents() {
            if (this.__hasBindEvent) return;
            var that = this;
            $(document.body).on((this.opts.clickEventType || 'tap'), function (e) {
                var $t = $(e.target), $menu = $t.closest('.menu-list');
                if (!($menu && $menu.length)) {
                    that.hide();
                }
            });
            ($(this.opts.scrollParent) || $(win)).on('touchmove', function() {
                that.hide();
            });
            this.__hasBindEvent = true;
        }
        function init(opts) {
            if (this.$list) return;
            var that = this;
            this.opts = opts || {};
            this.report = opts.report || noop;
            this.jump = opts.jump || function(url) {
                window.location.href = url;
            }

            this.onShareHide = opts.onShareHide || noop;
            this.onShareBtnClick = opts.onShareBtnClick || noop;
            this.onShare = opts.onShare || noop;
            this.onShareMenuOpen = opts.onShareMenuOpen || noop;
            this.onShareClick = opts.onShareClick || noop;

            this.onBtnInit = opts.onBtnInit || function() {
                that.report({
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_inQQ_expo',
                    obj1: pageName
                });
            };
            this.onBtnClick = opts.onBtnClick || function() {
                that.report({
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_inQQ_launch',
                    obj1: pageName
                });
            };
            this.onItemClick = opts.onItemClick || function(src) {
                var m = src.match(/\/([^?\/]*)\.html(\?|$)/), to = m?m[1]:'unknown';
                if (src == 'share') to = 'share';
                that.report({
                    local: true,
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_inQQ_clk',
                    obj1: pageName,
                    obj2: to
                });
            }

            if (isMQQ()) {
                if (win.mqq.compare('5.3') != -1) {
                    win.mqq.ui.setTitleButtons({
                        right: {
                            title : "菜单",
                            hidden: false,
                            iconID: 3,
                            callback : function () {
                                toggle.call(that);
                                that.onBtnClick();
                            }
                        }
                    });
                    that.onBtnInit();
                } else if (win.mqq.compare('4.6') != -1) {
                    win.mqq.ui.setActionButton({/* title: "菜单",*/ iconID: 3 }, function(){
                        toggle.call(that);
                        that.onBtnClick();
                    });
                    that.onBtnInit();
                }
                build.call(that);
            }

            return this;
        }

        function show(opts) {
            if (!this.$list) init.call(this, opts);
            this.$list.addClass('z-open');
        }
        function hide() {
            this.$list && this.$list.removeClass('z-open');
        }
        function toggle(opts) {
            if (this.$list && this.$list.hasClass('z-open')) {
                this.hide();
            } else {
                this.show(opts);
            }
        }

        return {
            init: init,
            show: show,
            hide: hide,
            toggle: toggle
        }
    })();

    var navBtn = (function() {
        var defaultOpts = {
            actions: [
                {
                    name: 'Home',
                    url: 'http://ke.qq.com/mobilev2/index.html#from=' + pageName,
                    icon: 'icon-home'
                },
                {
                    name: 'CourseManagement',
                    url: 'http://ke.qq.com/mobilev2/courseManagement.html#from=' + pageName,
                    icon: 'icon-course-management'
                },
                {
                    name: 'CourseSchedule',
                    url: 'http://ke.qq.com/mobilev2/courseSchedule.html#from=' + pageName,
                    icon: 'icon-course-schedule'
                },
                {
                    name: 'Search',
                    url: 'http://ke.qq.com/mobilev2/courseList.html#from=' + pageName,
                    icon: 'icon-search'
                },
                {
                    name: 'Fav',
                    url: 'http://ke.qq.com/mobilev2/myFav.html#from=' + pageName,
                    icon: 'icon-fav'
                }//,
                //{
                //    name: 'Share',
                //    icon: 'icon-share'
                //}
            ],
            cb: function(action, item){

            },
            defaultStyle: 'left:0;top:0;',
            r: 171,
            x0: 36,
            y0: 36
        },
            cssStr = ".corner-nav-mask{display:none;position: fixed;top: -100%;left: 0;right: 0;bottom: -100%;background: rgba(0, 0, 0, 0.6);z-index: 20000;}.corner-nav{width:40px;height:40px;position:fixed;right:16px;bottom:16px;z-index:20001}.corner-nav .nav-btn,.corner-nav .nav-item{width:40px;height:40px;border-radius:20px;border:0;padding:0;position:absolute;top:0;left:0}.corner-nav .nav-btn:focus{outline:none;}.corner-nav .nav-btn{z-index:1;background:url("+__uri("../modules/common/navBtn/img/sprite.png")+") #167dd2 no-repeat top center;background-size:28px auto;background-position:center 9px}.corner-nav .nav-btn.open{background-image:none}.corner-nav .nav-btn.open:after,.corner-nav .nav-btn.open:before{content:\"\";display:block;position:absolute;top:50%;left:50%;width:66.7%;height:2px;background:#fff}.corner-nav .nav-btn.open:before{-webkit-transform:translate(-50%,-50%) rotate(45deg)}.corner-nav .nav-btn.open:after{-webkit-transform:translate(-50%,-50%) rotate(-45deg)}.corner-nav .nav-item{opacity:0;background:#fff;-webkit-transform:translate3d(0,0,0);-webkit-transition:opacity .1s,left .1s,top .1s}.corner-nav .nav-item.open{opacity:1}.corner-nav .nav-item .icon{width:40px;height:40px;display:block;background:url("+__uri("../modules/common/navBtn/img/sprite.png")+") no-repeat;background-size:28px auto;border-radius:20px}.corner-nav .icon.icon-home{background-position:center -31px}.corner-nav .icon.icon-course-management{background-position:center -71px}.corner-nav .icon.icon-course-schedule{background-position:center -108px}.corner-nav .icon.icon-search{background-position:center -151px}.corner-nav .icon.icon-fav{background-position:center -188px}.corner-nav .icon.icon-share{background-position:center -229px}";

        function calStyle(i, options){
            var n = options.actions && options.actions.length || 0,     // did not process length === 1
                alpha = i * (Math.PI/2/(n-1)),
                left = - options.r * Math.sin(alpha),
                top = - options.r * Math.cos(alpha);
            return 'left:'+left+'px;top:'+top+'px;';
        }

        function getTplStr() {
            var tpl = "";
            tpl += '<div id="js-corner-nav" class="corner-nav"><button id="js-nav-btn" class="nav-btn">&nbsp;</button><ul id="js-nav-list">';
            for(var i = 0, len = this.opts.actions.length; i<len; i++) {
                tpl += '<li class="nav-item" data-style="' + calStyle(i, this.opts) + '"><i class="icon ' + this.opts.actions[i].icon + '"></i></li>'
            }
            tpl += '</ul></div>';

            return tpl;
        }

        function bindEvents(){
            if(this.boundEvents) return;
            var that = this;
            this.$list.on((this.opts.clickEventType || 'tap'), function(e){
                toggle.call(that);
            });
            this.$list.on((this.opts.clickEventType || 'tap'), '.nav-item', function(){
                var index = that.$items.index(this),
                    action = that.opts.actions[index],
                    $this = $(this);
                $this.addClass('z-active');
                setTimeout(function() {
                    $this.removeClass('z-active');
                    hide.call(that);
                }, 300);
                if(action.url){
                    that.onItemClick(action.url, $this);
                    that.jump(action.url);
                }else{
                    that.opts.cb(action, $this);
                }
            });
            this.boundEvents = true;
        }

        function build() {
            importStyle(cssStr, 'css-menuList');
            var tpl = getTplStr.call(this);
            this.$list = $(tpl).appendTo(document.body);
            this.$mask = $('<div id="corner-nav-mask" class="corner-nav-mask"></div>').appendTo(document.body);
            this.$navBtn = this.$list.find('.nav-btn');
            this.$items = this.$list.find('.nav-item');

            bindEvents.call(this);
            this.onBtnInit();
        }

        function init(opts){
            if (this.$list) return;
            var that = this;
            opts = $.extend({}, defaultOpts, opts);
            this.opts = opts;
            this.report = opts.report || noop;
            this.jump = opts.jump || function(url) {
                window.location.href = url;
            }

            this.onBtnInit = opts.onBtnInit || function() {
                that.report({
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_expo',
                    obj1: pageName
                });
            };
            this.onBtnClick = opts.onBtnClick || function() {
                that.report({
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_launch',
                    obj1: pageName
                });
            };
            this.onItemClick = opts.onItemClick || function(src) {
                var m = src.match(/\/([^?\/]*)\.html(\?|$)/), to = m?m[1]:'unknown';
                that.report({
                    local: true,
                    module: 'Y-MQ-Cycle',
                    action: 'cycle_clk',
                    obj1: pageName,
                    obj2: to
                });
            }

            build.call(that);

            return this;
        }

        function open(){
            this.$mask.show();

            this.$navBtn.addClass('open');
            this.$items.addClass('open').each(function(i, item){
                item.setAttribute('style', item.getAttribute('data-style'));
            });

            this.isOpen = true;
            this.onBtnClick();
        }

        function close(){
            var that = this;
            this.$mask.hide();

            this.$navBtn.removeClass('open');
            this.$items.removeClass('open').each(function(i, item){
                item.setAttribute('style', that.opts.defaultStyle);
            });

            this.isOpen = false;
        }

        function toggle(){
            (this.isOpen?close:open).call(this);
        }

        return {
            init: init,
            show: open,
            hide: close,
            toggle: toggle
        }
    })();

    function init(opts) {
        if (this.nav) return this;
        //get elements
        $ = win.$;

        if (isMQQ()) {
            this.nav = menuList.init(opts);
        } else {
            this.nav = navBtn.init(opts);
        }
        return this;
    }

    win.serviceNav = {
        init: init,
        show: function() {
            if (!this.nav) return this;
            this.nav.show();
            return this;
        },
        hide: function() {
            if (!this.nav) return this;
            this.nav.hide();
            return this;
        },
        toggle: function() {
            if (!this.nav) return this;
            this.nav.toggle();
            return this;
        }
    };
})(window, window.$);