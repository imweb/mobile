/*
 * scrollBar
 * 2014/12/25 by lqlongli
 * 模拟滚动条组件，fix一些滚动条问题，比如某些android版本下的textarea滚动问题
 *
 */

var $ = require('zepto');
var defaultOpts = {};
require('common/scrollBar/scrollBar.async.scss');

var scrollBar = {
	init: function(opts) {
		this.opts = $.extend({}, defaultOpts, opts);
		this.$box = this.opts.$box;

		this.$wrapper = $('<div class="scrollBar-warpper"></div>');
		this.$bar = $('<span class="bar"></span>').insertAfter(this.$box.addClass('scrollBar').wrap(this.$wrapper));

		this.refresh();
		this.bindEvents();
	},
	refresh: function() {
		this.boxHeight = this.$box.height();
		this.scrollHeight = this.$box[0].scrollHeight;
		if (this.boxHeight == this.scrollHeight) {
			this.$bar.hide();
			return;
		} else {
			this.$bar.show();
		}
		this.k = this.boxHeight / this.scrollHeight;
		this.$bar.height(this.boxHeight * this.k + 'px');
		this.scroll();
	},
	bindEvents: function() {
		var that = this;
		this.start = {};
		this.$box.on('touchstart', function(e) {
			that.start = {
				y: e.touches[0].pageY,
				scrollTop: $(this).scrollTop()
			};
		}).on('touchmove', function(e) {
			if (that.start.y === undefined) return;
			var deltaY = e.touches[0].pageY - that.start.y,
				scrollTop = that.start.scrollTop - deltaY;
			$(this).scrollTop(scrollTop);
			e.preventDefault();
		}).on('touchend', function(e) {
			that.start = {};
		}).on('scroll', function(e) {
			that.scroll.call(that, e);
		}).on('input', function(e) {
			that.refresh.call(that, e);
		});
	},
	scroll: function(e) {
		this.$bar.css('top', this.$box.scrollTop() * this.k + 'px');
	}
};

module.exports = scrollBar;