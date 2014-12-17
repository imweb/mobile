/**
 * authorized by aaronou
 * tab容器的控制工具条
 *
 * html:
 * <ul id="js-tab-bar" class="tab-bar border-bottom">
 *      <li class="tab-bar__item active" data-section="js-section-live"><a href="javascript:void(0)">直播课程</a></li>
 *      <li class="tab-bar__item" data-section="js-section-nonlive"><a href="javascript:void(0)">录播课程</a></li>
 * </ul>
 * <ul class="section-list">
 *      <li id="js-section-live" class="section section-contents"></li>
 *      <li id="js-section-nonlive" class="section section-contents"></li>
 * </ul>
 *
 * 初始化：
 * @$el: 容器元素
 * @onChange: tab切换回调
 * tabBar.init({
 *      $el: $('#js-tab-bar'),
 *      onChange: function (index, oldIndex) {}
 * });
 *
 * 获取当前index:
 * var index = tabBar.curTabId();
 *
 */

var $;

var $el, $items, $curItem, onChange, curId;

function init(opts) {
    $ = require('zepto');
    $el = opts.$el;
    $items = $el.find('.tab-bar__item');
    $curItem = $items.filter('.active');
    onChange = opts.onChange;
    curId = $items.index($curItem);
    bindEvents();
}

function bindEvents() {
    $el.on('tap', '.tab-bar__item', function () {
        var $this = $(this);
        if ($this.hasClass('active')) return;

        $curItem.removeClass('active');
        $this.addClass('active');
        var index = $items.index($this);
        $el.data('cur-tab', index);
        $('#' + $this.data('section')).show();
        $('#' + $curItem.data('section')).hide();

        onChange && onChange(index, $items.index($curItem));
        $curItem = $this;
        curId = index;
    });
}

function changeTo(index) {
    // todo where is time
}

module.exports = {
    init: init,
    changeTo: changeTo,
    curTabId: function () {
        return curId;
    }
};


