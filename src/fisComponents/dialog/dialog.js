/**
 * authorized by aaronou
 * 对话框
 *
 * 显示对话框:
 * @title: 对话框标题
 * @content: 对话框内容
 * @confirm: 确认按钮的文案
 * @cancel: 取消按钮的文案，如果不想显示取消按钮，则置空
 * @icon: icon类型：succ，warn
 * @needClose: 是否显示关闭按钮，默认falsle
 * @position: 对话框的位置：top，center，默认为center
 * @onConfirm: 确认回调，返回fase或者不返回则隐藏对话框
 * @onCancel: 取消回调，返回fase或者不返回则隐藏对话框
 * @onClose: 关闭回调
 * @afterInit: 对话框初始化回调，可以在这个回调中绑定对话框内容区域的事件
 * @textAlign: 内容区域的text-align
 * @titleTextAlign: 标题的text-align
 * @className: 自定义class样式
 * @allowMove: 当用户操作时是否允许滚动操作
 * dialog.show({
 *      title: '提示',
 *      content: '报名成功',
 *      confirm: '知道了'
 * });
 *
 */

require('common/dialog/dialog.async.scss');
var dialogTpl = require('common/dialog/dialog.tpl');

//var Dialog = (function(){

var defaultOpts = {
    title: '',
    content: '',
    confirm: '',
    cancel: '',
    icon: '',
    needClose: false,
    position: 'center',
    onConfirm: function () {
    },
    onCancel: function () {
    },
    onClose: function () {
    },
    afterInit: function () {
    },
    textAlign: 'left',
    titleTextAlign: 'center',
    className: '',
    allowMove: function () {
    }
}, $dom, $bg;

function bindEvents(opts) {
    //alert(2);
    if (opts.needClose) {
        $dom.on('click', '.dialog-close', function () {
            opts.onClose();
            hide();
        })
    }
    $dom.on('click', '.dialog-confirm-btn', function () {
        var ret = opts.onConfirm();
        !ret && hide();
    });
    $dom.on('click', '.dialog-cancel-btn', function () {
        var ret = opts.onCancel();
        !ret && hide();
    });
    $dom.on('click', function (e) {
        //alert(1);
        //e.stopPropagation();
    });
    var timer;
    $dom.on('touchstart', function (e) {
        var $t = $(e.target), activeTarget = $t.data('active-target');
        if (activeTarget) {
            var $target = $t.closest(activeTarget);
            if ($target) {
                $target.addClass('active');
            }
        } else {
            $t.addClass('active');
        }
        timer = setTimeout(function () {
            $t.removeClass('active');
        }, 300);
    }).on('touchmove touchend', function (e) {
        clearTimeout(timer);
        timer = null;
        var $t = $(e.target), activeTarget = $t.data('active-target');
        if (activeTarget) {
            var $target = $t.closest(activeTarget);
            if ($target) {
                $target.removeClass('active');
            }
        } else {
            $t.removeClass('active');
        }
        //new Image().src = '/'+ e.type + '_'+ e.type;
        if (e.type == 'touchmove' && !($t.is('button') || opts.allowMove($t, e))) {
            //new Image().src = '/testttttttttttttttttttt';
            e.preventDefault();
            //e.stopPropagation();
        }
    });
}

function show(opts) {
    if ($dom) hide();

    opts = $.extend({}, defaultOpts, opts);
    $dom = $(dialogTpl(opts)).appendTo(document.body);
    if (opts.position == 'center') {
        var $outer = $dom.filter('.dialog-outer');
        $outer.css('margin-top', '-' + ($outer.height() / 2) + 'px');
    }

    /*var userAgent = window.navigator.userAgent;
     if(userAgent && userAgent.toLowerCase().indexOf('android')!=-1){
     var matches = userAgent.match(/android ([\d\.]+);/i);
     if(matches.length && parseInt(matches[1])<4){
     $dom.css('-webkit-backface-visibility', 'hidden');
     }
     }*/
    setTimeout(function () {
        bindEvents(opts);
        opts.afterInit($dom);
        //new Image().src = '/'+$dom.height();
    }, 50);
}

function hide() {
    $dom && $dom.remove();
    $dom = null;
}

/*    return {
 show: show
 }
 })();*/

module.exports = {show: show};
