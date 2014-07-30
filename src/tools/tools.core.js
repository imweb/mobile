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
                    var imgUrl = e.srcElement.src,
                        pageUrl = window.location.href;


                    window.badjs && window.badjs('image load fail, image url: '+imgUrl+' page url: '+pageUrl+' e.msg: '+ e.type+' ', window.location, 0, 410101, 4);
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
                    !self.reportedNetworkType && badjs('network type is '+data+', typeof data is '+(typeof data), 'all', 0, 411064+data, 2);
                    self.reportedNetworkType = true;
                    cb(size);
                });
            }catch (e){
                !self.reportedNetworkType && badjs('error while get network type', 'all', 0, 411069, 2);
                self.reportedNetworkType = true;
                cb(222);
            }
        },


        getFixImgUrl : function (url , cb){

            this.getFixImgSize(function (size){
                cb(url + size);
            });

        },


        /**
         * 获得当前需要显示tip
         *
         * @param obj
         *          obj.sub_bgtime 开始时间
         *          obj.sub_endtime 结束时间
         *          obj.time 当前时间
         *          obj.publishTIme 发布时间
         * @returns {number}
         */
        getShowTipType : function (obj){
            if(obj.bgTime < obj.time && obj.time < obj.endTime ){
                return 2;
            }else if( (obj.time - obj.publishTime < 36000) && (obj.endTime > obj.time) && (obj.applyState == 1 ) ){ // 10小时内，有课程
                return 1
            }

            return 0;
        },


        now : function () {
            return +new Date;
        }

    }

    if(typeof define == 'function' && define.amd){
        define('tools' ,[] , function (){return window.tools});
    }

}());