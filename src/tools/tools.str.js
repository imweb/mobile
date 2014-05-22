/**
 * Created by chriscai on 2014/5/22.
 */
(function (){

    window.tools.str = {
        byteLen: function (str, len) {
            //正则取到中文的个数，然后len*count+原来的长度。不用replace
            var factor = len || 2;
            str += '';
            var tmp = str.match(/[^\x00-\xff]/g) || [];

            var count = tmp.length;
            return str.length + (factor - 1) * count;
        }
    }

}());