/**
 * authorized by aaronou
 * 数据拉取重试提示
 *
 * 初始化：
 * @word: 空提示文字，default: <span class="important">加载失败</span><br/>请确认网络正常后, 点击屏幕重新加载
 * @noPic: 是否不展示图片
 * @onRetryCb: 重试回调
 *
 * function load() {}
 * var fullScreenRetry = new FullScreenRetryTip({
 *      onRetryCb: load
 * });
 *
 * 插入到容器中，提示默认在容器内居中显示：
 * $container.html(fullScreenRetry.$dom);
 *
 * 移除提示：
 * fullScreenRetry.destroy();
 *
 */
var $ = require('zepto'),
    Base = require('common/Base');
require('common/FullScreenRetryTip/FullScreenRetryTip.async.scss');
var LoadMoreBtn = Base.extend({
    defaultOpts: {
        word: '<span class="important">加载失败</span><br/>请确认网络正常后, 点击屏幕重新加载'
    },
    initialize: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts);
        this.$dom = $('<div class="full-screen-retry-tip' + (this.opts.noPic ? ' no-pic' : '') + '">');
        this.$dom.html('<p>' + this.opts.word);
        var that = this;
        this.$dom.on('click', function () {
            that.opts.onRetryCb && that.opts.onRetryCb();
        });
    },
    destroy: function () {
        this.$dom.remove();
    }
});

module.exports = LoadMoreBtn;
