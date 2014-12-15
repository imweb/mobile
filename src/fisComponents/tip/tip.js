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

var $dom, $msg, $ico, visible, timer, isInit=false;
function init(){
    require('common/tip/tip.async.scss');
    $dom = $('<div class="tip"><div class="tip-bg"><i></i><span></span></div></div>');
    $dom.appendTo(document.body);
    $ico = $dom.find('i');
    $msg = $dom.find('span');
}

function show(msg, type, config){
    if(!isInit){
        init();
        isInit = true;
        setTimeout(function(){
            show(msg, type, config);
        }, 100);
        return;
    }
    if(typeof type == 'object'){
        config = type;
        type = null;
    }
    type = type || 'ok';
    config = $.extend({interval:3000}, config);
    var interval = config.interval;
    $dom.prop('className', 'tip '+(config.className||''));
    $ico[0].className = type;
    $msg.html(msg);
    $dom.addClass('show');
    visible = true;
    if (interval){
        clearTimeout(timer);
        timer = setTimeout(function (){
            hide();
        }, interval);
    }
}
function hide(){
    if (!$dom) return;
    $dom.removeClass('show');
    visible = false;
}

module.exports = {
    show: show,
    hide: hide
};
