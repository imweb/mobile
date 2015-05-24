/**
 * Created by aaronou on 4/5/2014.
 *
 * Tip.show('修改群头衔成功', 'ok');
 * Tip.show('修改群头衔成功', 'warning');
 * Tip.show('test', {
 *    className: 'blue-tip', //附加在tip上面的className
 *    interval: 5000 // 消失的延时
 * });
 * Tip.hide();
 *
 */

var $dom, $msg, $ico, visible, timer, isInit = false , showTimer, showFun, hideFun;
function init(opt) {
    showFun = opt && opt.showFun || showFun;
    hideFun = opt && opt.hideFun || hideFun;
    require('common/tip/tip.async.scss');
    $dom = $('<div class="tip"><div class="tip-bg"><i></i><span></span></div></div>');
    if (!(opt.buildDom && ($dom = opt.buildDom($dom)))) {
        $dom.appendTo(document.body);
    }
    $ico = $dom.find('i');
    $msg = $dom.find('span');
    isInit = true;
}

function show(msg, type, config) {
    if (!isInit) {
        init();
        showTimer = setTimeout(function () {
            show(msg, type, config);
        }, 100);
        return;
    }
    if (typeof type == 'object') {
        config = type;
        type = null;
    }
    type = type || 'ok';
    config = $.extend({interval: 3000}, config);
    var interval = config.interval;
    $dom.prop('className', 'tip ' + (config.className || ''));
    $ico[0].className = type;
    $msg.html(msg);
    showFun ? showFun($dom) : $dom.addClass('show');
    visible = true;
    if (interval) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            hide();
            config.cb && config.cb();
        }, interval);
    }
}
function hide() {
    if(showTimer) window.clearTimeout(showTimer);
    if (!$dom) return;
    hideFun ? hideFun($dom) : $dom.removeClass('show');
    visible = false;
}

module.exports = {
    init: init,
    show: show,
    hide: hide,
    getMsg: function() {
        return $msg && $msg.text() || "";
    },
    isShow: function(){
        return visible;
    }
};
