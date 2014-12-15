/**
 *
 * mqq 里面的 tip web 实现
 *
 * Tip.show('修改群头衔成功', 'ok');
 * Tip.show('修改群头衔成功', 'ok');
 *
 * depends zepto.js
 *
 *
 * Created by aaronou on 4/5/2014.
 */

var Tip = (function (){
    var $dom, $msg, $ico, visible, timer, isInit=false;
    function init(){
        $dom = $('<div class="m-ui-tip"><div class="tip-bg"></div><i></i><span></span></div>');
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
        type = type || 'ok';
        config = $.extend({interval:3000}, config);
        var interval = config.interval;

        $ico[0].className = type;
        $msg.html(msg);
        $dom.addClass('show');

        /*if (config.top == 'middle')
            $dom.style.top = document.body.clientHeight/2 - $dom.clientHeight*3/4 + 'px';
        else*/
        //$dom.style.top = config.top+'px';

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

    return {
        show: show,
        hide: hide
    }
})();