/**
 * authorized by aaronou
 * 列表loading提示
 *
 * 初始化：
 * @word: loading提示文字，default: 正在加载
 * @noPic: 是否不展示图片
 * var fullScreenLoading = new FullScreenLoading();
 *
 * 插入到容器中，提示默认在容器内居中显示：
 * $container.html(fullScreenLoading.$dom);
 *
 * 显示loading:
 * @delay: 延迟显示，单位ms，传入0则不延迟显示
 * fullScreenLoading.show(delay);
 *
 * 隐藏loading:
 * fullScreenLoading.hide();
 *
 * 移除提示：
 * fullScreenLoading.destroy();
 *
 */
var $ = require('zepto'),
    Base = require('common/Base'), timer;
var DEFAULT_DELAY = 500;
require('common/FullScreenLoading/FullScreenLoading.async.scss');
var FullScreenLoading = Base.extend({
    defaultOpts: {
        word: '正在加载',
	    delay: DEFAULT_DELAY
    },
    initialize: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts);
        this.$dom = $('<div class="full-screen-loading' + (this.opts.noPic ? ' no-pic' : '') + '">');
        this.$dom.html('<p>' + this.opts.word);
    },
    show: function (delay) {
        if (delay === undefined) delay = this.opts.delay;
        if (parseInt(delay) > 0) {
            var that = this;
            clearTimeout(timer);
            timer = setTimeout(function () {
                that.$dom.show();
            }, delay);
        } else {
            this.$dom.show();
        }
    },
    hide: function () {
        clearTimeout(timer);
        this.$dom.hide();
    },
    destroy: function () {
        clearTimeout(timer);
        this.$dom.remove();
    }
});

module.exports = FullScreenLoading;
