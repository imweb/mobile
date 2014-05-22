/**
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

})();