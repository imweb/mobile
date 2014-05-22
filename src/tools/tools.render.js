/**
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

}());