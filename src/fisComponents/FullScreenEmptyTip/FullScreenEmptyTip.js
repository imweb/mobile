/**
 * authorized by aaronou
 * 列表为空提示
 *
 * 初始化：
 * @word: 空提示文字，default: 当前列表为空
 * @noPic: 是否不展示图片
 * var fullScreenEmptyTip = new FullScreenEmptyTip({
 *      word: '暂无报名课程',
 *      noPic: true
 * });
 *
 * 插入到容器中，提示默认在容器内居中显示：
 * $container.html(fullScreenEmptyTip.$dom);
 *
 * 移除提示：
 * fullScreenEmptyTip.destroy();
 *
 */

var $ = require('zepto'),
    Base = require('common/Base');
require('common/FullScreenEmptyTip/FullScreenEmptyTip.async.scss');
var FullScreenEmptyTip = Base.extend({
    defaultOpts: {
        word: '当前列表为空'
    },
    initialize: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts);
        this.$dom = $('<div class="full-screen-empty-tip' + (this.opts.noPic ? ' no-pic' : '') + '">');
        this.$dom.html('<p>' + this.opts.word);
    },
    destroy: function () {
        this.$dom.remove();
    }
});

module.exports = FullScreenEmptyTip;
