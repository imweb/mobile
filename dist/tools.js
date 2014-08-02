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

}());;/**
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

}());;/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */

(function (){
    window.tools.cookie = {
        /**
         * @description 读取cookie
         * @public
         * @param {String} n 名称
         * @returns {String} cookie值
         * @example
         *      $.cookie.get('id_test');
         */
        get: function (n) {
            var m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
            return !m ? "" : decodeURIComponent(m[2]);
        },
        /**
         * @description 设置cookie
         * @public
         *
         * @param {String} name cookie名称
         * @param {String} value cookie值
         * @param {String} [domain = ""] 所在域名
         * @param {String} [path = "/"] 所在路径
         * @param {Number} [hour = 30] 存活时间，单位:小时
         * @example
         *      $.cookie.set('value1','cookieval',"id.qq.com","/test",24); //设置cookie
         */
        set: function (name, value, domain, path, hour) {
            var expire = new Date();
            expire.setTime(expire.getTime() + (hour ? 3600000 * hour : 30 * 24 * 60 * 60 * 1000));

            document.cookie = name + "=" + value + "; " + "expires=" + expire.toGMTString() + "; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "");
        },

        /**
         * @description 删除指定cookie,复写为过期 !!注意path要严格匹配， /id 不同于/id/
         * @public
         *
         * @param {String} name cookie名称
         * @param {String} [domain] 所在域
         * @param {String} [path = "/"] 所在路径
         * @example
         *      $.cookie.del('id_test'); //删除cookie
         */
        /*del: function (name, domain, path) {
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "");
        },
        /**
         * @description 删除所有cookie -- 这里暂时不包括目录下的cookie
         * @public
         *
         * @example
         *      $.cookie.clear(); //删除所有cookie
         */

        /*clear: function () {
            var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));
            // 删除所有cookie
            for (var i in rs) {
                document.cookie = rs[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; ";
            }
        },
        /**
         * 获取uin，针对业务,对外开源请删除
         * @public
         *
         * @return {String} uin值
         * @example
         *      $.cookie.uin();
         */
        uin: function () {
            var u = T.cookie.get("uin");
            return !u ? null : parseInt(u.substring(1, u.length), 10);
        }
    };
}());
;/**
 * Created by chriscai on 2014/5/22.
 */
(function (){

    var Events  = {

        on: function(name, callback, context) {
            if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
            this._events || (this._events = {});
            var events = this._events[name] || (this._events[name] = []);
            events.push({callback: callback, context: context, ctx: context || this});
            return this;
        },

        once: function(name, callback, context) {
            if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
            var self = this;
            var once = _.once(function() {
                self.off(name, once);
                callback.apply(this, arguments);
            });
            once._callback = callback;
            return this.on(name, once, context);
        },

        off: function(name, callback, context) {
            var retain, ev, events, names, i, l, j, k;
            if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
            if (!name && !callback && !context) {
                this._events = void 0;
                return this;
            }
            names = name ? [name] : _.keys(this._events);
            for (i = 0, l = names.length; i < l; i++) {
                name = names[i];
                if (events = this._events[name]) {
                    this._events[name] = retain = [];
                    if (callback || context) {
                        for (j = 0, k = events.length; j < k; j++) {
                            ev = events[j];
                            if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                                (context && context !== ev.context)) {
                                retain.push(ev);
                            }
                        }
                    }
                    if (!retain.length) delete this._events[name];
                }
            }

            return this;
        },

        trigger: function(name) {
            if (!this._events) return this;
            var args = slice.call(arguments, 1);
            if (!eventsApi(this, 'trigger', name, args)) return this;
            var events = this._events[name];
            var allEvents = this._events.all;
            if (events) triggerEvents(events, args);
            if (allEvents) triggerEvents(allEvents, arguments);
            return this;
        }

    };

    var eventSplitter = /\s+/;

    var eventsApi = function(obj, action, name, rest) {
        if (!name) return true;

        if (typeof name === 'object') {
            for (var key in name) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
            return false;
        }

        if (eventSplitter.test(name)) {
            var names = name.split(eventSplitter);
            for (var i = 0, l = names.length; i < l; i++) {
                obj[action].apply(obj, [names[i]].concat(rest));
            }
            return false;
        }

        return true;
    };

    var triggerEvents = function(events, args) {
        var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
        switch (args.length) {
            case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
            case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
            case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
            case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
            default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
        }
    };


    /**
     * 事件分发器
     *
     * @type {{on: on, once: once, off: off, trigger: trigger, createInstance: createInstance}}
     */
    window.tools.events = {
        on : Events.on,
        once : Events.once ,
        off : Events.off,
        trigger : Events.trigger,

        /**
         * 创建一个全新的events 实力
         * @returns {Events}
         */
        createInstance: function (){
            var Obj = function (){};
            Obj.prototype = Events;
            return new Obj();
        }
    }

}());;/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */


(function () {


    function _html_entities_refs(level) {
        var decodeMap = {};

        //HTML 4.01 支持 ISO 8859-1 (Latin-1) 字符集。
        //ISO-8859-1 的较低部分（从 1 到 127 之间的代码） ASCII 有部分
        //ISO-8859-1 的较高部分（从 160 到 255 之间的代码）全都有实体名称
        //除此之外，还有：
        //   数学符号: 8704 - 8901 ，有空隙
        //   希腊字母: 913 - 982
        //   其他实体: 3xx(5个),4xx(1个),7xx(2个),8xxx,9xxx若干
        //注意：实体名称对大小写敏感

        //1-160: 有refname的ASCII实体外加nbsp(空格)
        if (level >= 0) {
            decodeMap['&quot;'] = 34;
            decodeMap['&amp;'] = 38;
            decodeMap['&apos;'] = 39;
            decodeMap['&lt;'] = 60;
            decodeMap['&gt;'] = 62;
            decodeMap['&nbsp;'] = 160;
        }
        //160-255: 有refname的字符实体和符号实体
        if (level >= 1) {
        }

        if (level >= 2) {
            //TODO:不常用，待补充
        }

        return decodeMap;
    }

    var _decodeDict = {};
    var _decodeReg = {};
    var _encodeDict = {};
    var _encodeReg = {};

    var getDecodeDict = function (level) {
        if (!_decodeDict[level]) {
            _decodeDict[level] = _html_entities_refs(level);
        }

        return _decodeDict[level];
    }

    var getEncodeDict = function (level) {
        if (!_encodeDict[level]) {
            var decodeDict = getDecodeDict(level);
            var encodeDict = {};
            for (key in decodeDict) {
                //encodeDict[String.fromCharCode(decodeDict[key])] = key;
                encodeDict[String.fromCharCode(decodeDict[key])] = '&#' + decodeDict[key] + ';';
            }
            //fix:lose normal space
            encodeDict[' '] = '&#32;';
            _encodeDict[level] = encodeDict;
        }

        return _encodeDict[level];
    }

    var getDecodeReg = function (level) {
        if (!_decodeReg[level]) {
            _decodeReg[level] = new RegExp('(' + getDictKeys(getDecodeDict(level)).join('|') + ')', 'g');
        }
        return _decodeReg[level];
    }

    var getEncodeReg = function (level) {
        if (!_encodeReg[level]) {
            _encodeReg[level] = new RegExp('[' + getDictKeys(getEncodeDict(level)).join('') + ']', 'g');
        }
        return _encodeReg[level];
    }

    var getDictKeys = function (dict) {
        var keys = [];
        for (p in dict) {
            if (dict.hasOwnProperty(p)) {
                keys.push(p);
            }
        }
        return keys;
    }


    var htmlEncodeDict = {'"': "#34", "<": "#60", ">": "#62", "&": "#38", " ": "#160" };
    htmlEncodeDict[String.fromCharCode(160)] = '#160';


    // 正则表达式
    var REGEXP_LT = /</g;
    var REGEXP_GT = />/g;
    var REGEXP_QUOTE = /"/g;
    var REGEXP_ATTR_TAG = /<(\/)*([a-zA-Z0-9_:\.\-]+)([^>a-zA-Z0-9_:\.\-]+[^>]*)*>/ig;
    var REGEXP_ATTR_NAME = /[^>a-zA-Z0-9_:\.\-]*([a-zA-Z0-9_:\.\-]+)=[\"\']?([^\"\'\s>]*)[\"\']?/ig;
    var REGEXP_ATTR_VALUE = /&#([a-zA-Z0-9]*);?/img;
    var REGEXP_ATTR_NO_NAME = /[^>a-zA-Z0-9_:\.\-]/ig;
    var REGEXP_DEFAULT_ON_TAG_ATTR_1 = /\/\*|\*\//mg;
    var REGEXP_DEFAULT_ON_TAG_ATTR_2 = /^[\s"'`]*((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
    var REGEXP_DEFAULT_ON_TAG_ATTR_3 = /\/\*|\*\//mg;
    var REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
    var REGEXP_DEFAULT_ON_TAG_ATTR_5 = /e\s*x\s*p\s*r\s*e\s*s\s*s\s*i\s*o\s*n/ig;
    var REGEXP_URL = new RegExp("((news|telnet|nttp|file|http|ftp|https)://){1}(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*", "gi");

    //var IMG_EXP = /([^'"]+)[^>]*/ig
    var REGEXP_NONE_URL = new RegExp("(?:[^\\\'\\\"]|^|\s+)((((news|telnet|nttp|file|http|ftp|https)://)|(www\\.))(([-A-Za-z0-9]+(\\.[-A-Za-z0-9]+)*(\\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\\.[0-9]{1,3}){3}))(:[0-9]*)?(/[-A-Za-z0-9_\\$\\.\\+\\!\\*\\(\\),;:@&=\\?/~\\#\\%]*)*)(?![^<]*</a>)", "gi");

    var REGEXP_SPACE = /^\s|\s$/ig;

    /*
     * 默认HTML标签白名单
     * 标签名=>属性列表
     */
    var defaultWhiteList = {
        h1: {},
        h2: {},
        h3: {},
        h4: {},
        h5: {},
        h6: {},
        hr: {},
        span: {},
        strong: {},
        b: {},
        i: {},
        br: {},
        p: {},
        pre: {},
        code: {},
        a: {
            'target': {
                'default': '_blank'
            },
            'href': true,
            'title': true
        },
        img: {
            'src': true,
            'alt': true,
            'title': true,
            'rel': true
        },
        div: {},
        table: {
            'border': true
        },
        tr: {'rowspan': true},
        td: {'colspan': true},
        th: {'colspan': true},
        tbody: {},
        thead: {},
        ul: {},
        li: {},
        ol: {},
        dl: {},
        dt: {},
        em: {},
        cite: {},
        section: {},
        header: {},
        footer: {},
        blockquote: {},
        audio: {'autoplay': true, 'controls': true, 'loop': true, 'preload': true, 'src': true},
        video: {'autoplay': true, 'controls': true, 'loop': true, 'preload': true, 'src': true}
    };

    var defaultWhiteAttrList = {
        'width': true,
        'height': true,
        'style': true
    }

    /**
     * 判断对象是否为空
     *
     * @param {String} obj 对象
     * @return {String}返回true or false
     */
    var isNUll = function (obj) {
        if (!obj) return true;
        for (var i in obj) {
            return false;
        }
        return true;
    }

    /**
     * 过滤属性值
     *
     * @param {String} tag 标签名
     * @param {String} attr 属性名
     * @param {String} value 属性值
     * @return {String} 若不需要修改属性值，不返回任何值
     */
    function defaultOnTagAttr(tag, attr, value) {
        if (REGEXP_ATTR_NO_NAME.test(attr)) {
            return '';
        }
        var _default = defaultWhiteList[tag][attr];
        var regexp = _default && _default['regexp'];
        var _dfvalue = _default && _default['default'];
        if (attr === 'href' || attr === 'src') {
            REGEXP_DEFAULT_ON_TAG_ATTR_1.lastIndex = 0;
            if (REGEXP_DEFAULT_ON_TAG_ATTR_1.test(value)) {
                return _dfvalue || '#';
            }
            REGEXP_DEFAULT_ON_TAG_ATTR_2.lastIndex = 0;
            if (REGEXP_DEFAULT_ON_TAG_ATTR_2.test(value)) {
                return _dfvalue || '#';
            }
            REGEXP_URL.lastIndex = 0;
            if (!REGEXP_URL.test(value)) {//合格URL
                return _dfvalue || '#';
            }
            if (regexp) {
                regexp.lastIndex = 0;
                if (!regexp.test(value)) {//合格URL
                    return _dfvalue || '#';
                }
            }
            return value;
        } else if (_default || defaultWhiteAttrList[attr]) {//白名单属性
            REGEXP_DEFAULT_ON_TAG_ATTR_3.lastIndex = 0;
            if (REGEXP_DEFAULT_ON_TAG_ATTR_3.test(value)) {
                return _dfvalue || '';
            }
            REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0;
            if (REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value)) {
                return _dfvalue || '';
            }
            if (attr === 'style') {
                REGEXP_DEFAULT_ON_TAG_ATTR_5.lastIndex = 0;
                if (REGEXP_DEFAULT_ON_TAG_ATTR_5.test(value)) {
                    return _dfvalue || '';
                }
            }
            return value;
        }
        return '';
    }


    /**
     * @param {String} html 需要过滤的字符串
     * @param {String} args 保留原始字符串，不进行强制转义，在发表的时候需
     *
     */
    var filter = function (html, args) {
        var DataObj = {}, DataIndex = 0 , currReplace = {};

        REGEXP_ATTR_TAG.lastIndex = 0;
        html = html.replace(REGEXP_ATTR_TAG, function () {
            var _targName = arguments[2] || '';
            _targName = _targName.toLowerCase(),
                _defaultWhiteList = defaultWhiteList[_targName];
            if (!_targName || !_defaultWhiteList) return arguments[0] || '';//没有标签名，过滤标签
            if (arguments[1]) {//结束标记
                if (currReplace[_targName] && currReplace[_targName].length) {
                    currReplace[_targName].pop();
                    if (!currReplace[_targName].length) delete currReplace[_targName];
                    DataObj[DataIndex] = '</' + arguments[2] + '>';
                    return '{%DataIndex_' + (DataIndex++) + '%}';
                } else {
                    return '</' + arguments[2] + '>';
                }
            } else {
                var _classStr = (arguments[3] || '').replace(REGEXP_SPACE, '');//获取属性值
                if ((_classStr === '/' || !_classStr) && !isNUll(_defaultWhiteList))  arguments[0] || '';//需要有属性值
                if (_classStr) {
                    REGEXP_ATTR_NAME.lastIndex = 0;
                    //console.log(_classStr , REGEXP_ATTR_NAME.test(_classStr), '++++++++++++++++++');
                    if (REGEXP_ATTR_NAME.test(_classStr)) {
                        REGEXP_ATTR_NAME.lastIndex = 0;
                        var _lastClassStr = [];
                        _classStr.replace(REGEXP_ATTR_NAME, function () {//依次判断属性类型
                            var _attrName = arguments[1].toLowerCase();
                            var _attrValue = arguments[2];
                            var value = defaultOnTagAttr(_targName, _attrName, _attrValue);
                            _lastClassStr.push(value ? ' ' + _attrName + '="' + value + '"' : '');
                        });
                        _classStr = _lastClassStr.join('');
                    } else {
                        _classStr = '';
                    }
                    //console.log(_classStr , '=============');
                }
                if ((_classStr === '/' || !_classStr) && !isNUll(_defaultWhiteList)) return  arguments[0] || '';//需要有属性值
                if (!currReplace[_targName]) currReplace[_targName] = [];
                currReplace[_targName].push(_targName);
                DataObj[DataIndex] = '<' + _targName + (_classStr ? (' ' + _classStr) : '') + '>';
                return '{%DataIndex_' + (DataIndex++) + '%}';
            }
        });
        if (!args) {
            html = html.replace(REGEXP_LT, '&lt;')
                .replace(REGEXP_GT, '&gt;');
        }
        html = html.replace(/\{\%DataIndex_(\d+)\%\}/ig,function () {
            return DataObj[arguments[1]] || '';
        }).replace(REGEXP_NONE_URL, '<a href="$1" target="_blank">$1</a>');
        var _tags = [];
        for (var i in currReplace) {
            if (i === 'img' || i === 'br' || i === 'p' || i === 'hr') continue;
            var _len;
            if (_len = currReplace[i].length) {
                for (var j = 0; j < _len; j++) {
                    _tags.push('</' + i + '>');
                }
            }
        }
        if (_tags.length) {
            html += _tags, join('');
        }
        //console.log(html);
        return html;
    };

    // ================= export  ==============//


    window.tools.html  = {

        /**
         * @description 将字符串里entity解码成对应的符号，如&lt;对应<
         * @param {String} s 原始字符串
         * @return {String} 处理后字符串
         * @example
         *      $.str.decodeHtml('&lt;script&gt;&lt;/script&gt;'); 返回结果为："<script></script>"
         */
        decodeHtml: function (s, level) {
            level = !isNaN(level) ? level : 0;

            s += '';
            var reg = getDecodeReg(level);
            var dict = getDecodeDict(level);

            return s.replace(reg,function (all, key) {
                return '&#' + dict[key] + ';';
            }).replace(/&#x([a-f\d]+);/g,function (all, hex) {
                    return '&#' + parseInt("0x" + hex) + ';';
                }).replace(/&#(\d+);/g, function (all, number) {
                    return String.fromCharCode(+number);
                });
        },
        /**
         * @description 将字符串里的"<"、"&"等转成对应entity
         * @param {String} s 原始字符串
         * @return {String} 处理后字符串
         * @example
         *      $.str.encodeHtml('<script></script>'); 返回结果为："&lt;script&gt;&lt;/script&gt;"
         */
        encodeHtml: function (s, level) {
            level = !isNaN(level) ? level : 0;

            s += '';
            var reg = getEncodeReg(level);
            var dict = getEncodeDict(level);
            return s.replace(reg, function (all) {
                return dict[all];
            });
        },
        filter: filter



    };

})();;/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */

;
(function () {


    function fillZero(number) {
        return ("0" + number).slice(-2, 3);
    }

    //1：默认显示日期+时间
    //2: 显示日期
    //3: 显示时间
    function format(timestamp, type, server_time) {

        type = type || 1;

        var now = server_time ? new Date(server_time * 1000) : new Date();
        var time = new Date(timestamp * 1000);

        var format_time = fillZero(time.getHours()) + ":" + fillZero(time.getMinutes());
        var format_date = "";

        //判断是否今天
        if (now.getFullYear() == time.getFullYear() && now.getMonth() == time.getMonth() && now.getDate() == time.getDate()) {

            format_date = "今天";
        }
        else {

            format_date = fillZero((time.getMonth() + 1)) + "月" + fillZero(time.getDate()) + "日";
        }

        var weekdaymap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        switch (type) {
            case 1:
                return format_date + " " + format_time;
            case 2:
                return format_date;
            case 3:
                return format_time + ":" + fillZero(time.getSeconds());
            case 4: //2月20日 周四
                return formatDate('M月DD日', time) + ' ' + weekdaymap[time.getDay()];
            case 5: //昨天 一周内 更早
                return fromNow(time, now, '1-en');
            case 6: //2014-02-12 16:08
                return formatDate('YYYY-MM-DD hh:mm', time);
            default:
                break;
        }
    }

    //秒或分钟转为小时
    function changeHour(time) {

        var hour = Math.floor(time / 60 / 60);
        var mins = Math.floor(time / 60 % 60);

        return hour + ":" + mins;
    }

    /**
     * @日期格式化
     *
     * @param {String} pattern 日期格式 (格式化字符串的符号参考w3标准 http://www.w3.org/TR/NOTE-datetime)
     * @param {Date Object} date 待格式化的日期对象
     * @return {String} 格式化后的日期字符串
     * @example
     *      formatDate("YYYY-MM-DD hh:mm:ss", (new Date()));
     */
    function formatDate(pattern, date) {

        if (typeof date == 'number') date = new Date(date);

        function formatNumber(data, format) {//3
            format = format.length;
            data = data || 0;
            //return format == 1 ? data : String(Math.pow(10,format)+data).substr(-format);//IE6有bug
            //return format == 1 ? data : (data=String(Math.pow(10,format)+data)).substr(data.length-format);
            return format == 1 ? data : String(Math.pow(10, format) + data).slice(-format);
        }

        return pattern.replace(/([YMDhsm])\1*/g, function (format) {
            switch (format.charAt()) {
                case 'Y' :
                    return formatNumber(date.getFullYear(), format);
                case 'M' :
                    return formatNumber(date.getMonth() + 1, format);
                case 'D' :
                    return formatNumber(date.getDate(), format);
                case 'w' :
                    return date.getDay() + 1;
                case 'h' :
                    return formatNumber(date.getHours(), format);
                case 'm' :
                    return formatNumber(date.getMinutes(), format);
                case 's' :
                    return formatNumber(date.getSeconds(), format);
            }
        });
    }

    var fromNowTimeSepStyles = {
        '1': [
            [0, '今天'],
            [24 * 3600, '昨天'],
            [3 * 24 * 3600, '一周内'],
            [7 * 24 * 3600, '更早']
        ],
        '1-en': [
            [0, 'today'],
            [24 * 3600, 'yesterday'],
            [3 * 24 * 3600, 'thisweek'],
            [7 * 24 * 3600, 'earlier']
        ],
        '2': [
            [60, '刚刚'],
            [60 * 60, '$m分钟前'],
            [10 * 3600, '$h小时前'],
            [23 * 3600, '今天'],
            [24 * 3600, '昨天'],
            [2 * 24 * 3600, '前天'],
            [3 * 24 * 3600, '一周内'],
            [7 * 24 * 3600, '一周前'],
            [30 * 24 * 3600, '一个月前'],
            [3 * 30 * 24 * 3600, '三个月前'],
            [183 * 24 * 3600, '半年前'],
            [365 * 24 * 3600, '一年前']
        ]
    };

    function fromNow(time, now, style) {
        style = style || 'default';
        now = now || new Date();
        time = new Date(time * 1000);

        if (now) {
            now = new Date(now * 1000);
        }
        else now = new Date();

        var arr = fromNowTimeSepStyles[style] || fromNowTimeSepStyles['1'];

        var t = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        if (time instanceof Date) time = time.getTime();

        var diff = t - time;

        var item, str;
        for (var i = 0, len = arr.length; i < len; i++) {
            item = arr[i];
            if (diff > item[0] * 1000) str = item[1];
            else break;
        }

        return str;
    }

    function fromNowStr(time, now) {

        time = new Date(time * 1000);
        now = now ? new Date(now * 1000) : new Date();

        var diff = (now - time) / 1000;

        if (diff < 60)return "刚刚";

        if (diff < 60 * 60)return Math.floor(diff / 60) + "分钟前";

        if (diff < 24 * 3600)return Math.floor(diff / 3600) + "小时前";

        if (diff < 10 * 24 * 36000)return Math.floor(diff / 24 / 3600) + "天前";

        return "很久之前";
    }

    function fromStartTime(start, now) {

        start = new Date(start * 1000);
        now = now ? new Date(now * 1000) : new Date();

        var diff = (start - now) / 1000;

        if (diff < 0)return "已结束";
        if (diff < 60)return "1分钟";

        var day = Math.floor(diff / (3600 * 24));
        var hour = Math.floor((diff - day * 3600 * 24) / 3600);
        var mins = Math.ceil((diff - hour * 3600  - day * 3600 * 24) / 60);

        var res = (day ? day + "天" : "") + (hour ? hour + "小时" : "") + (mins ? mins + "分钟" : "");

        return res;
    }

    var t_delta_cache = {};

    /**
     * @获取课程的时间相关状态
     *
     * @param item {Object} 课程对象  一般直接传入cgi返回的课程对象即可(约束: 字段名需要cgi统一!)
     * @param result {result} 附加信息对象  一般直接传入cgi返回的result字段即可(主要是从中读取server_time这个信息)
     * @return ret {Object} 时间状态信息
     *    ret.ec                0 成功  1 参数错误(一般是item里字段不对)
     *    ret.status            0 正在直播  1 尚未开始  -1 已经结束
     *    ret.expired_str       过期课程的wording:  今天,昨天,一周内,更早
     *    ret.t_delta           判定时间时使用的参考时间偏移.
     * @example
     *      $.render.time.courseStatus(data.result.items[i],data.result);
     */
    function courseStatus(item, result) {

        if (!item || !item.begintime || !item.endtime) return {ec: 1};

        var t0 = item.begintime * 1000;
        var t1 = item.endtime * 1000;
        var t_now = new Date().getTime();


        var t_delta = 0;

        if (result && result.server_time) {
            t_delta = (result.server_time * 1000 + 100) - t_now;
        }
        else if (item.id && t_delta_cache[item.id]) {
            t_delta = t_delta_cache[item.id];
        }

        if (t_delta > 2000 || t_delta < -2000) {//@magic_num: 2s内的误差忽略
            t_delta = 0;
        }

        if (item.id && t_delta) {
            t_delta_cache[item.id] = t_delta;
        }

        t_now += t_delta;

        var status;

        if (t_now < t0) status = 1;
        else if (t_now > t1) status = -1;
        else status = 0;

        var rst = {
            ec: 0,
            status: status
        };

        if (t_delta) {
            rst.t_delta = t_delta;
        }

        if (status == -1) {
            rst.expired_str = $.render.time.format(item.endtime, 5, Math.floor(t_now / 1000));
        }

        return rst;

    }


    /**
     * data = {
     *
     * [注意] 服务器返回时间单位为 秒.
     *  time : xx // 开始时间
     *  sub_bgtime : xx // 下一节课开始时间
     *  sub_endtime : xx // 下一节课结束时间
     *  sys_time : xx // 服务器返回的当前时间
     *  lesson : xx // 总课程
     *  curr_lesson :  xxx // 当前课时
     *  loop :xx  // 重复类型 ， 1 每天，2 每周 ， 3 每月
     *  cycle_info : [] // 重复的数据
     * }
     * @param data
     * @returns {string}
     */
    var renderCourseTime = function (data) {
        var str = '';
        str += formatDate('M月D日', data.time * 1000)

        switch (data.loop) {
            case 1 :
                str += '起 每天';
                break;
            case 2 :
                str += '起 每周';
                break;
            case 3 :
                str += '起 每月';
                break;
            default :
                break;
        }

        if(data.cycle_info && data.cycle_info.length >=0){
            var loopDate = [];
            data.cycle_info.forEach(function (value , key){
                if(data.loop == 3){ // 每月
                    loopDate.push(value);
                    return ;
                }
                switch(value ){
                    case 1: loopDate.push('一');break;
                    case 2:loopDate.push('二');break;
                    case 3:loopDate.push('三');break;
                    case 4:loopDate.push('四');break;
                    case 5:loopDate.push('五');break;
                    case 6:loopDate.push('六');break;
                    case 7:loopDate.push('七');break;
                }
            });

            str += loopDate.join('、') + (data.loop == 3 ? '日':'');
        }


        if (data.sub_bgtime) {
            str += ' ' + formatDate('hh:mm', data.sub_bgtime * 1000);
        }

        if (data.sub_endtime) {
            str += '~' + formatDate('hh:mm', data.sub_endtime * 1000);
            if(new Date(data.sub_bgtime*1000).getDate()!=new Date(data.sub_endtime*1000).getDate()){
                str += '(第二天)';
            }
        }


        if (data.lesson) {
            str += ' 共' + data.lesson + '节，';
        } else { // 没有lesson 返回
            return str;
        }

        if (data.curr_lesson == 0) { // 无课程
            if (data.sub_endtime < data.sys_time) {
                str += '课程' + fromStartTime(data.sub_endtime, data.sys_time);
            }
        } else {

            if (data.sub_bgtime < data.sys_time && data.sub_endtime > data.sys_time) { // 正在
                str += '<span class="hot">正在上第' + data.curr_lesson + '节课</span>';
            } else { // 未开始
                str += '第' + data.curr_lesson + '节 <span class="hot">' + fromStartTime(data.sub_bgtime, data.sys_time) + '</span> 后开始';
            }
        }


        return str;


    };


    var price = function (price, nounit) {
        return price == 0 ? "免费" : (!price ? "" : (price / 100).toFixed(2) + (nounit ? '' : '元'));
    };

    window.tools.render = {
        time : {
            format: format,
            changeHour: changeHour,
            formatDate: formatDate,
            courseStatus: courseStatus,
            fromNow: fromNow,
            fromNowStr: fromNowStr,
            fromStartTime: fromStartTime,
            renderCourseTime: renderCourseTime
        },
        price: price
    };

}());;/**
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

})();;/**
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

}());;/**
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

})();;/**
 * Created by chriscai on 2014/6/14.
 */
(function (){

    window.tools.mobile = {
        isIOS : function (){
	        if (navigator.userAgent.toLowerCase().indexOf('iphone') > 0) {
				return true;
	        }
	        return false;
        },

	    isAndroid : function (){
		    if (navigator.userAgent.toLowerCase().indexOf('android') > 0) {
			    return true;
		    }
		    return false;
	    },

	    version : function (){
		    var version = 0;
		    if(window.tools.isMobile.isIOS()){
			    version = navigator.userAgent.match(/ os ([\d_]+) /i)[1];
			    version && (version =  version.replace(/_/gi ,'.'));
			     version = version ?  version.replace(/_/gi ,'.') : 0;
		    }else {
			    version = navigator.userAgent.match(/android ([\d\.]+);/i)[1];
			    version && (version =  version.replace(/_/gi ,'.'));
		    }
		    return version;
	    }
    }

}());