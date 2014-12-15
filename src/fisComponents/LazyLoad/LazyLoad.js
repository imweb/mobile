/**
 * authorized by aaronou
 * 图片lazyload, 集成WebP和图片监控上报, 简版可看LazyLoadPure
 *
 * 初始化:
 * var lazyLoad = new LazyLoad({
 *      type: 'background', // 'img' || 'background', img图片路径会设置在src属性, background则设置在background-image
 *      $parent: $container, // 父元素, 默认为$(window)
 *      selector: '.course-cover[data-src]', // 对什么节点进行lazyload
 *      onLoad: function($img, src){}, // 每张图片lazyload之后都会回调,
 *      useWebP: false, // 是否使用WebP, 基于Tools的isSupportedWebP进行判断
 *      shouldReport: false, // 是否上报图片监控
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
    T = require('common/tools.ext'),
    Base = require('common/Base'),
    reportChance = .5;

var LazyLoad = Base.extend({
    initialize: function(opts){
        this.type = opts.type || 'img';
        this.$parent = opts.$parent || $(window);
        this.useWebP = opts.useWebP;
        this.$win = $(window);
        this.shouldReport = opts.shouldReport;
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
                //console.log(offset.top, scrollTop, winHeight, img);
                if(offset.top > scrollTop + winHeight*1.5){
                    return false;
                    //return true;
                }
                var img2 = new Image(), startTime = +new Date();
                img2.onload = function(){
                    img.onload = function(){
                        that.onLoad && that.onLoad();
                    };
                    if(that.type == 'background'){
                        $img.css('background-image', 'url('+src+')');
                    }else{
                        $img.attr('src', src);
                    }
                    if(that.shouldReport && Math.random() < reportChance){
                        var endTime = +new Date();
                        require.async(['common/speed'], function(Speed){
                            T.getNetworkType(function(type){
                                type = type > 0 ? type : 0;
                                T.isSupportedWebP(function(isSupported){
                                    var reportArgs = {};
                                    reportArgs[type * 3 + (isSupported?1:2)] = endTime - startTime;
                                    reportArgs[type * 3 + 3] = endTime - startTime;
                                    Speed.speedReport(reportArgs, {
                                        isdFlags: '7832-53-37'
                                    });
                                });
                            });
                        });
                    }
                };
                img2.onerror = function(){
                    //$img.data('isLoad', 0);
                    if(that.shouldReport){
                        badjs && badjs('image load error:'+src, window.location.href, 0, 488005, 4);
                    }
                };

                if(that.useWebP){
                    T.isSupportedWebP(function(isSupported){
                        if(isSupported){
                            src += (src.indexOf('?')!=-1?'&':'?') + 'tp=webp';
                        }
                        img2.src = src;
                    });
                } else {
                    img2.src = src;
                }
                $img.data('isLoad', 1);


            }
        });
        return this;
    }
});

module.exports = LazyLoad;

