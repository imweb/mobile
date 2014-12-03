/**
 *  @info:
 *  @author: chriscai
 *  @date: 14-4-4
 */
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


    /**
     * 显示离指定时间的wording
     *
     * '1': [
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
     * @param time
     * @param now
     * @param style
     * @returns {*}
     */
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


    /**
     * 指定一个开始时间和结束，显示距离差距的wording
     *
     * 间距wording 显示：
     * 一分钟内 刚刚
     * 一个小时内  xx分钟内
     * 一天内  xxx小时内
     * 24天内   xxx天前
     *
     * 其他  很久之前
     *
     * @param time - 结束时间
     * @param now - 开始时间
     * @returns {string}
     */
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


    window.tools.render = {
        time : {
            format: format,
            changeHour: changeHour,
            formatDate: formatDate,
            fromNow: fromNow,
            fromNowStr: fromNowStr
        }
    };

}());