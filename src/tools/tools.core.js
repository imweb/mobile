/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */

;(function () {


    window.tools = window.T = {

        ratio: function () {
            if (arguments.callee.ratio) {
                return arguments.callee.ratio;
            }
            var ratio = window.devicePixelRatio >= 2 ? 2 : 1;
            arguments.callee.ratio = ratio;
            return ratio;
        },

        loadImages: function ($imgs, type) {
            var self = this;
            $imgs.each(function (index, $img) {
                if(type=='background' && $img.style.backgroundImage){
                    return;
                }else if((type=='src'||type===undefined) && $img.getAttribute('src')){
                    return;
                }
                var $i = new Image(), src = $img.getAttribute('data-src');
                $i.onload = function () {
                    if (type === 'background') {
                        $img.style.backgroundImage = 'url(' + src + ')';
                    } else {
                        $img.src = src;
                    }
                };
                $i.onerror = function (e) {

                };
                $i.src = src;
            });
        },

        jump: function (url) {
            if (window.mqq && window.mqq.ui && window.mqq.ui.openUrl) {
                window.mqq.ui.openUrl({
                    url: url,
                    target: 1,
                    style: 3
                });
            } else {
                window.location.href = url;
            }
        },


        getFixImgSize : function ( cb){
            var self = this;
            try{
                window.mqq.device.getNetworkType(function(data){
                    var size = '';
                    switch (data){
                        case '2':
                        case 2: size=90;break;
                        default :  size=222;break;
                    }
                    self.reportedNetworkType = true;
                    cb(size);
                });
            }catch (e){
                self.reportedNetworkType = true;
                cb(222);
            }
        },


        getFixImgUrl : function (url , cb){

            this.getFixImgSize(function (size){
                cb(url + size);
            });

        },



        now : function () {
            return +new Date;
        }

    }


    if(typeof define == 'function' && define.amd){
        define([] , function (){return window.tools});
    }

}());