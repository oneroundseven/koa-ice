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

module.exports = {
    info: (msg)=> {
        logger.info(msg);
    },
    error: (msg)=> {
        logger.warn(msg);
    },
    warn: (msg)=> {
        logger.warn(msg);
    }
};
