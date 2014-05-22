/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */


(function () {


    window.tools.report = (function () {

        var errorIds = []
        var resourceReport = function (e , url,  errorId) {
            var isSuccess = e.type === 'load';
            if(isSuccess){
                return ;
            }
            errorId = errorId || (url.indexOf(location.hostname) == -1 ? errorIds[0] : errorIds[1]);
            var msg =  (isSuccess ? 'success' : 'fail');
            console.log(msg);
            badjs(msg, url, 0, errorIds, 4);
        }

        var init = function (eIds){
                errorIds = eIds;
        }


        return {
            init : init,
            resourceReport: resourceReport
        }
    }());

})();