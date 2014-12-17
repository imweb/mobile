/**
 * authorized by aaronou
 * 列表加载状态提示
 *
 * 初始化：
 * @word: [object]
 *          -empty: 列表为空文字提示，default: 此列表没有数据
 *          -loading: 列表拉取数据文字提示，default: 正在拉取数据
 *          -loadMore: 可以拉取更多数据文字提示，default: 拉取更多数据
 *          -noMore: 没有更多数据文字提示，default: 没有更多数据
 * var loadMoreBtn = new LoadMoreBtn();
 *
 * 插入到容器中，提示默认在容器内居中显示：
 * $container.html(loadMoreBtn.$dom);
 *
 * 显示空提示:
 * loadMoreBtn.showEmpty();
 *
 * 显示加载提示:
 * loadMoreBtn.showLoading();
 *
 * 显示加载更多提示:
 * loadMoreBtn.showLoadMore();
 *
 * 显示没有更多数据提示:
 * loadMoreBtn.showNoMore();
 *
 * 显示提示:
 * loadMoreBtn.show();
 *
 * 隐藏提示
 * loadMoreBtn.hide();
 *
 * 移除提示：
 * loadMoreBtn.destroy();
 *
 */

var $ = require('zepto'),
    Base = require('common/Base');
require('common/LoadMoreBtn/LoadMoreBtn.async.scss');
var LoadMoreBtn = Base.extend({
    defaultOpts: {
        words: {
            empty: '此列表没有数据',
            loading: '正在拉取数据',
            loadMore: '拉取更多数据',
            noMore: '没有更多数据'
        }
    },
    initialize: function (opts) {
        this.opts = $.extend({}, this.defaultOpts, opts);
        this.$dom = $('<button id="js-load-more" class="load-more-btn">');
        this.showLoading();
    },
    showEmpty: function () {
        this.$dom.removeClass('loading').show();
        this.$dom.html(this.opts.words.empty);
    },
    showLoading: function () {
        this.$dom.addClass('loading').show();
        this.$dom.html(this.opts.words.loading);
    },
    showLoadMore: function () {
        this.$dom.removeClass('loading').show();
        this.$dom.html(this.opts.words.loadMore);
    },
    showNoMore: function () {
        this.$dom.removeClass('loading').show();
        this.$dom.html(this.opts.words.noMore);
    },
    show: function () {
        this.$dom.show();
    },
    hide: function () {
        this.$dom.hide();
    },
    destroy: function () {
        this.$dom.remove();
    }
});

module.exports = LoadMoreBtn;
