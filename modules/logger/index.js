// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const pino = require('pino');
const fs = require('fs');
const setting = require('../setting');
const pretty = pino.pretty();

/**
 * server: 启动日志
 * visiting: 访问日志
 * static: 静态资源访问日志
 */
const LOG_TYPE = ['server', 'visiting', 'static'];

pretty.pipe(process.stdout);

const logger = pino({
    name: 'koa-ice',
    safe: true
}, pretty);

let logPath = process.cwd() + setting.logPath;

if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

LOG_TYPE.map((item, index)=> {
    if (!fs.existsSync(logPath + '/' + item + '.log')) {
        fs.openSync(logPath + '/' + item + '.log', 'w');
    }
});

function fsName(type) {
    var d = new Date();
    var m = d.getMonth() + 1;

    return d.getFullYear() + '_' + (m < 10 ? ('0' + m) : m) + '_' +
        (d.getDate() < 10 ? ('0'+ d.getDate()) : d.getDate());
}

function formatDate(fmt, dateStr) {
    var d = (dateStr ? new Date(dateStr) : new Date());
    var tmp = fmt;

    var o = {
        "M+": d.getMonth() + 1, //月份
        "d+": d.getDate(), //日
        "h+": d.getHours(), //小时
        "m+": d.getMinutes(), //分
        "s+": d.getSeconds(), //秒
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度
        "S": d.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(tmp)) tmp = tmp.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(tmp)) {
            tmp = tmp.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return tmp;
}

function formatMessage(msg) {
    //return (global.IP ? (global.IP + ' ') : '') + formatDate('yyyy-MM-dd hh:mm:ss') + ' ' + msg + '\r\n';
}

module.exports = {
    visit: (msg)=> {
        let filePath = logPath + '/visiting.log';
        fs.appendFile(filePath, formatDate('yyyy-MM-dd hh:mm:ss') + msg + '\r\n', (err)=> {
            if (err) throw err;
        });
    },
    trace: ()=> {

    },
    info: (msg)=> {
        logger.info('test hello');
    },
    debug: ()=> {

    },
    error: ()=> {

    },
    warn: (msg)=> {

    }
};
