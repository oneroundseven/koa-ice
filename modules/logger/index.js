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

function fsName(type) {
    var d = new Date();
    var m = d.getMonth() + 1;

    return d.getFullYear() + '_' + (m < 10 ? ('0' + m) : m) + '_' +
        (d.getDate() < 10 ? ('0'+ d.getDate()) : d.getDate());
}

function reName() {

}

module.exports = {
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
