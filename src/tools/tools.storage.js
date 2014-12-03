/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */


(function () {

    window.tools.storage = (function () {

        var key = T.cookie.uin() + '_storage_';


        function save ( obj , cb) {
            try {
                localStorage.setItem(key, JSON.stringify(obj));
            } catch (e) {
                localStorage.clear();
                localStorage.setItem(key, JSON.stringify(obj));
                cb && cb(); // 如果报错，回调
            }
        }

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

                save(obj , cb)
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
                    obj = JSON.parse(objStr);
                    delete obj[k];
                    save(obj )
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