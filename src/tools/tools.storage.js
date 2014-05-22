/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */


(function () {


    window.tools.storage = (function () {

        var preKey = 'tools', prefix = T.cookie.uin() +  preKey;

        function init (str){
            prefix = str;
        }

        function set(k, v , cb) {
            if (window.localStorage) {
                /*var objStr = localStorage.getItem(prefix+k), obj;
                if (objStr) {
                    try {
                        obj = JSON.parse(objStr);
                    } catch (e) {
                        obj = objStr;
                    }
                } else {
                    obj = '';
                }*/
                try {
                    localStorage.setItem(prefix+k, v);
                } catch (e) {
                    console.log('localstorage error');
                    window.Badjs && window.Badjs('localStorage exception: '+e.message, window.location.href, 0, 413028, 2);
                    localStorage.clear();
                    cb && cb(); // 如果报错，回调
                    //localStorage.setItem(key, '');
                }
            }
        }

        function get(k) {
            if (window.localStorage) {
                var objStr = localStorage.getItem(prefix+k), obj;
                /*if (objStr) {
                    try {
                        obj = JSON.parse(objStr);
                        return obj[k];
                    } catch (e) {
                        return null;
                    }
                }*/
                return objStr;
            }
            return null;
        }

        function clear() {
            if (window.localStorage) {
                localStorage.setItem(prefix+k);
            }
        }

        return {
            init : init,
            set: set,
            get: get,
            clear: clear
        }
    }());

})();