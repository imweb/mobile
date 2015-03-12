/*
 * H5report.ext
 * 2015/02/28 by lqlongli
 *
 * 用于H5页面的tdw report扩展
 * 由于H5页面跳转的特性，丢掉上报的概率较大，因此提供另一种方案：
 * 在跳转前的数据上报放到localstorage中，在新页面的第一次tdw上报时把localstorage里的数据上报一起上报
 *
 * 改造考虑：
 * 要求：
 * 1. 项目改动最小化
 * 2. 适用所有的H5项目
 * 主要问题：
 * 1. H5项目模块结构不统一，有amd也有cmd
 * 2. 需要使用到localstorage的接口，有的项目有库，有的没有
 * 3. 由于2，看似最好的方案--在原来的tdw.report上修改的话，依赖localstorage会很麻烦
 *    而且H5项目的tdw.report组件并不统一（因1），改动较大，后续维护也会有麻烦
 *
 * 改造方案：
 * 1. 复制本文件的初始化代码，并提供相应的参数，在每个页面初始化一次即可
 * 2. 复制代码建议放在：
 *    + report中间层，有些H5项目不是直接引用tdw.report库，而是引用中间层，在里面先进行tdw.config，所以可以放在这里一起初始化
 *    + 每个页面的初始化代码里，可以利用inline特性
 *
 * 复制代码后，在最后一行传入两个对象
 * @report: tdw.report组件对象
 * @localStorage: localStorage库对象，要求方法名为set, get, remove
 *
 */

;(function(report, local, win) {
    var LC_KEY = 'MOBILE_TDW_REPORT';
    (function(fun) {
        report.tdw = function(params, args, table, options) {
            var localData;
            if (params.local) {
                delete params.local;
                localData = local.get(LC_KEY) || [];
                localData = typeof localData === "string" ? win.JSON.parse(localData) : localData;  //不是所有的localstorage库都是基于json对象的，因此只能向下兼容基于string的
                localData.push([params, args, table, options, +new Date]);
                local.set(LC_KEY, win.JSON.stringify(localData));
            } else {
                if (!this.hasReportLocal) {
                    localData = local.get(LC_KEY) || [];
                    localData = typeof localData === "string" ? win.JSON.parse(localData) : localData;
                    for (var i = 0, len = localData.length; i < len; ++i) {
                        if (+new Date - localData[i][4] < 24*3600*1000) {   //只上报一天内的
                            localData[i].pop();
                            fun.apply(report, localData[i]);
                        }
                    }
                    local.remove(LC_KEY);
                    this.hasReportLocal = true; //每个实例只在第一次report的时候上报local，不然每次report都检测local会很浪费资源
                }
                fun.apply(report, [params, args, table, options]);
            }
        };
    })(report.tdw);
})(report, localStorage, window);