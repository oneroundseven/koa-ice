// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */
const debug = require('../debug/index');

function formatDate(fmt, dateStr) {
    let d = (dateStr ? new Date(dateStr) : new Date());
    let tmp = fmt;

    let o = {
        "M+": d.getMonth() + 1, //月份
        "d+": d.getDate(), //日
        "h+": d.getHours(), //小时
        "m+": d.getMinutes(), //分
        "s+": d.getSeconds(), //秒
        "q+": Math.floor((d.getMonth() + 3) / 3) //季度
    };

    if (/(y+)/.test(tmp)) tmp = tmp.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    if (/(S+)/.test(tmp)) tmp = tmp.replace(RegExp.$1, ("000" + d.getMilliseconds()).substr(("" + d.getMilliseconds()).length));
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(tmp)) {
            tmp = tmp.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return tmp;
}

function visitLogFormat(koaRequest, koaResponse) {
    let loggerStr = '['+ formatDate('yyyy-MM-dd hh:mm:ss.SSS') +']:'+ koaRequest.method + ' ' + koaResponse.status + ' ' + koaRequest.href + ' ' + koaRequest.headers['user-agent'];
    if (koaResponse.status === 404) {
        debug.warn(loggerStr);
    } else {
        debug.info(loggerStr);
    }
    return loggerStr;
}

module.exports.formatDate = formatDate;
module.exports.visitLogFormat = visitLogFormat;