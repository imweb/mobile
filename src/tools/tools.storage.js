/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */


(function () {

    // is designed to store all information of an user in one key,
    // do not try to separate the content into different keys,
    // otherwise you will have to consider how to clear all information about a single user,
    // and the value type that needs to storage.

    window.tools.storage = (function () {

        var key = T.cookie.uin() + 'kecheng';

        function set(k, v, cb) {
            if (window.localStorage) {
                var objStr = localStorage.getItem(key), obj;
                if (objStr) {
                    try {
                        obj = JSON.parse(objStr);
                    } catch (e) {
                        obj = {};
                    }
                } else {
                    obj = {};
                }
                obj[k] = v;
                try {
                    localStorage.setItem(key, JSON.stringify(obj));
                } catch (e) {
                    //console.log('localstorage error');
                    window.Badjs && window.Badjs('localStorage exception: '+e.message, window.location.href, 0, 413028, 2);
                    localStorage.clear();
                    cb && cb(); // 如果报错，回调
                    //localStorage.setItem(key, '');
                }
            }
        }

        function get(k) {
            if (window.localStorage) {
                var objStr = localStorage.getItem(key), obj;
                if (objStr) {
                    try {
                        obj = JSON.parse(objStr);
                        return obj[k];
                    } catch (e) {
                        return null;
                    }
                }
                return objStr;
            }
            return null;
        }

        function remove(k){
            if(window.localStorage){
                //localStorage.removeItem(prefix+k);
                var objStr = localStorage.getItem(key), obj;
                if(objStr){
                    try{
                        obj = JSON.parse(objStr);
                        delete obj[k];
                        localStorage.setItem(key, JSON.stringify(obj));
                    }catch(e){

                    }
                }
            }
        }

        function clear() {
            if (window.localStorage) {
                localStorage.clear();
            }
        }

        return {
            set: set,
            get: get,
            clear: clear,
            remove: remove
        }
    }());

})();