/**
 * authorized by aaronou
 * 列表数据更新提示，用于更新localstorage缓存数据的场景
 *
 * 初始化：
 * @content: 更新提示文字，元素内容
 * @tagName: 元素标签，defalut: div
 * var refreshingTip = new RefreshingTip({
 *      content: '正在更新数据...',
 * });
 *
 * 插入到容器中，提示默认在容器内居中显示：
 * $container.html(refreshingTip.$dom);
 *
 * 移除提示：
 * refreshingTip.destroy();
 *
 */

var $ = require('zepto'),
    Base = require('common/Base');
require('common/RefreshingTip/RefreshingTip.async.scss');
var RefreshingTip = Base.extend({
    defaultOpts: {
        tagName: 'div'
    },
    initialize: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts);
        this.$dom = $('<' + this.opts.tagName + ' class="refreshing-tip">');
        this.$dom.html(this.opts.content || '');
    },
    destroy: function () {
        var that = this;
//        this.$dom.remove();
        this.$dom.css({maxHeight: 0, marginTop: 0});
        setTimeout(function () {
            that.$dom.remove();
        }, 1000);
    }
});

module.exports = RefreshingTip;
