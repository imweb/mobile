/**
 * Created by chriscai on 2014/5/22.
 */
(function (){

    window.tools.bom = {
        /**
         * @description 读取location.search
         *
         * @param {String} n 名称
         * @return {String} search值
         * @example
         *      $.bom.query('mod');
         */
        query: function (n) {
            var m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
            return !m ? "" : decodeURIComponent(m[2]);
        },
        /**
         *@description 读取location.hash值
         *
         *@param {String} n 名称
         *@return {String} hash值
         *@example
         *      $.bom.hash('mod');
         */
        getHash: function (n) {
            var m = window.location.hash.match(new RegExp("(#|&)" + n + "=([^&]*)(&|$)"));
            return !m ? "" : decodeURIComponent(m[2]);
        }
    }

}());