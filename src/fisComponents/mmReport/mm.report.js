/**
 * authorized by aaronou
 * 用于MM上报, 主要用于CGI的监控, 现在尝试接入脚本加载
 *
 * MMReport.report(url, result, time);
 *  url String cgi名称, 一般直接使用CGI地址, 前置项目标识
 *  result Number 必须是number, 否则统计系统不会统计, 0是成功, 其它是错误
 *  time Number 耗时
 *
 */

var seq = [], timer, defaultArgs = {
    appid: 1000202,//在线教育平台
    releaseversion: null,
    touin: null,
    frequency: 1,
    key: 'commandid,resultcode,tmcost'
};

function report(command, result, time) {
    seq.push([command, result, time]);
    notify();
}

function notify() {
    clearTimeout(timer);
    if (seq >= 10) { // in case there are too many report
        submit();
        timer = null;
    } else {
        timer = setTimeout(submit, 2000);
    }
}

function submit() {
    var args = $.extend({}, defaultArgs, {
        releaseversion: T.mobileSysInfo(),
        touin: T.cookie.uin() || 'null'
    });
    var seq2 = seq.slice();
    seq = [];
    for (var i = 0, len = seq2.length; i < len; i++) {
        for (var j = 0; j < 3; j++) {
            args[(i + 1) + '_' + (j + 1)] = seq2[i][j];
        }
    }
    var src = 'http://wspeed.qq.com/w.cgi?', argsStr = [];
    for (var key in args) {
        argsStr.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
    }
    new Image().src = src + argsStr.join('&') + '&random=' + T.now();
}

window.MMReport = module.exports = {
    report: report
};
