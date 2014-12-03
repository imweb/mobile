/**
 * image lazy load
 *
 * <img lazy-src="http://xxxx.jpg"  />
 *
 * options : {
 *  target :  search img of tag from this dom
 *  srcSign : the src will be read for load  , default is lazy-src
 * }
 *
 */

(function (){



    var ImgLazyLoad = function (options){

        var $dom , cache = []  , srcSign = 'lazy-src' ;

        var init = function (){
            $dom = $(options.target);
            if(options.srcSign){
                srcSign = options.srcSign;
            }
            resetCache();
            bindEvent();
            scrollHandler();
        }


        var setSrc = function($target, srcSign, errCallBack){

            if($target.attr("src") == $target.attr(srcSign))return ;


            var src = $target.attr(srcSign);
            $target[0].onerror = function (e) {
                options.err && options.err($target);
            };
            $target[0].onload = function (e) {
                options.succ && options.succ($target);
            }
            $target[0].src = src;
        }

        var resetCache = function (){
            var imgArr = $dom.find('img['+srcSign+']');
            imgArr.each(function(key , value) {
                var node = this.nodeName.toLowerCase(), url = $(this).attr(srcSign);
                var data = {
                    obj: $(this),
                    tag: node,
                    url: url
                };
                cache.push(data);
            });
        }

        var scrollHandler = function (){
            //动态显示数据
            var contHeight = $(window).height();
            var contop = $(window).scrollTop();
            $.each(cache, function(i, data) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;
                if (o) {
                    post = o.offset().top - contop, posb = post + o.height();

                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //改变src
                                setSrc(o, srcSign);
                            }
                        }
                        data.obj = null;
                    }
                }
            });
        }

        var bindEvent = function (){
            $dom.bind( 'scroll' , scrollHandler);
        }

        this.reset = function (){
            resetCache();
            scrollHandler();
        }

        init();
    }


    window.ImgLazyLoad = ImgLazyLoad;
})