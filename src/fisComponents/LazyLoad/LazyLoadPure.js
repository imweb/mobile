/**
 * authorized by aaronou
 * 图片lazyload纯净版
 *
 * 初始化:
 * var lazyLoad = new LazyLoad({
 *      type: 'background', // 'img' || 'background', img图片路径会设置在src属性, background则设置在background-image
 *      $parent: $container, // 父元素, 默认为$(window)
 *      selector: '.course-cover[data-src]', // 对什么节点进行lazyload
 *      onLoad: function($img, src){} // 每张图片lazyload之后都会回调
 * });
 *
 * 需要自行绑定事件:
 * $container.on('scroll touchmove', function(){
 *      lazyLoad.load();
 * })
 *
 * 当$container的节点改变时, 需要reset一下:
 * lazyLoad.reset().load();
 *
 */


var $ = require('zepto'),
    Base = require('common/Base');

var LazyLoad = Base.extend({
    initialize: function(opts){
        this.type = opts.type || 'img';
        this.$parent = opts.$parent || $(window);
        this.$win = $(window);
        this.selector = opts.selector || 'img';
        this.$elements = this.$parent.find(this.selector);
        this.onLoad = opts.onLoad;
    },
    reset: function(){
        this.$elements = this.$parent.find(this.selector);
        return this;
    },
    load: function(){
        var that = this;
        this.$elements.each(function(j, img){
            var $img=$(img), src = $img.data('src'), isLoading=$img.data('isLoad');
            if(src && !isLoading){
                var offset = $img.offset(),
                    imgHeight = $img.height(),
                    scrollTop = that.$win.scrollTop(),
                    winHeight = that.$win.height();
                if(offset.top + imgHeight < scrollTop){
                    return true;
                }
                if(offset.top > scrollTop + winHeight*1.5){
                    return false;
                }
                var img2 = new Image();
                img2.onload = function(){
                    img.onload = function(){
                        that.onLoad && that.onLoad($img, src);
                    };
                    if(that.type == 'background'){
                        $img.css('background-image', 'url('+src+')');
                    }else{
                        $img.attr('src', src);
                    }
                };
                img2.onerror = function(){};
                img2.src = src;
                $img.data('isLoad', 1);
            }
        });
        return this;
    }
});

module.exports = LazyLoad;

