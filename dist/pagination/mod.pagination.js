/**
 *  @info:
 *  @author: chriscai
 *  @date: 2014/8/21
 */

define(['zepto'] , function ($){

    var Pagination = function (setting){

        var opt = {} ,
            $ctn ,
            fixBottom  ,
            scrollBottomCb = [] ,
            scrollTopCb = [] ,
            cacheData = [] ,
            loadMoreTips = ['正在加载更多' , '没有更多数据'],
            $loadMore,
            self = this;

        var init = function (){
           $ctn = $(setting.target);

            fixBottom = setting.fixBottom || 50;

            opt = setting;

            opt.loadMoreTip && (loadMoreTips[0] = opt.loadMoreTip);

            opt.noMoreTip && (loadMoreTips[0] = opt.noMoreTip);

            $ctn.wrap('<div class="mod-pagination__wrap"></div>').parent().append('<div id="js-load-more" class="mod-pagination__more">'+loadMoreTips[0]+'</div>');

            $loadMore = $('#js-load-more');

            bindEvent()

        }


        var bindEvent = function (){

            var $body = $('body');
            var checkLoadMore = function (){
                var scrollTop = $('body').scrollTop();
                var innerHeight = window.innerHeight;
                var scrollHeight = $body.prop('scrollHeight');
                if (scrollTop + innerHeight + fixBottom >= scrollHeight ) {
                    return true;
                }
                return false;
            }


           var start = 0 , end = 0 , scrollTop = false;
           $(document).on('touchend' , function (e){
               if ($('body').scrollTop() > 0 ){
                   return ;
               }
               if (e.changedTouches[0].pageY - start > 0) {
                    self.triggerScrollTop();
               }
           });

            $(document).on('touchstart' , function (e){
                start = e.targetTouches[0].pageY
            });

            var callbacking = false;
            $(window).scroll(function (){
                if(callbacking ){
                    return ;
                }

                if(!checkLoadMore()){
                   return ;
                }

                callbacking = true;
                setTimeout(function (){
                    self.triggerScrollBottom();
                    callbacking = false;
                },25);
            });
        }

        this.reset = function (data , ext){
            cacheData = data;
            $ctn.html('');
            $.each(data , function (key , value){
                $ctn.append(opt.itemTmpl(value , ext));
            });
        }

        this.append = function (data , ext){
            cacheData.concat(data);
            $.each(data , function (key , value){
                $ctn.append(opt.itemTmpl(value , ext));
            });
        }

        this.getItemCount = function (){
            return cacheData.length;
        }

        this.getItem = function (index){
            return cacheData[index];
        }

        this.showEmptyTip = function (){
            $loadMore.text(loadMoreTips[1])
        }

        this.showLoadMoreTip = function (){
            $loadMore.text(loadMoreTips[0])
        }

        this.onScrollBottom = function (callback){
            scrollBottomCb.push(callback)
        }

        this.onScrollTop = function (callback){
            scrollTopCb.push(callback)
        }

        this.triggerScrollBottom = function (){
            $.each(scrollBottomCb , function (key , value){
                value();
            });
        }

        this.triggerScrollTop = function (){
            $.each(scrollTopCb , function (key , value){
                value();
            });
        }


        init();
    }

    return Pagination;

});