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
 * error: 错误及警告日志
 */
const LOG_TYPE = ['server', 'visiting', 'static', 'error'];

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

let mode = global.mode;
function devLog() {
    if (mode == 'dev') {
        console.log()
    }

}

module.exports = {
    info: (msg, file)=> {
        logger.info(msg);
        devLog(msg);
    },
    error: (msg, file)=> {
        logger.error(msg);
        devLog(msg);
    },
    warn: (msg, file)=> {
        logger.warn(msg);
        devLog(msg);
    }
};
