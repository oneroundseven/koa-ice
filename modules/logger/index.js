// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const pino = require('pino');
const fs = require('fs');
const util = require('../util');
const setting = require('../setting');
const path = require('path');

/**
 * server: 启动日志
 * visiting: 接口访问日志
 * error: 错误及警告日志
 */
const LOG_TYPE = ['server', 'visiting', 'error'];
let noop = function() {};
let logName = 'koa-ice';

var pretty = ()=> {
    return new pino.pretty({
        crlf: true,
        formatter: (ori, preFunction)=> {
            let line = '[';
            line += util.formatDate('yyyy-MM-dd hh:mm:ss') + '] ';
            line += preFunction.asColoredLevel(ori) + ' ';
            line += preFunction.chalk.cyan(ori.msg);

            return line;
        }
    });
};

let consolePretty = pretty();
consolePretty.pipe(process.stdout);
const consoleAppender = pino({
    name: logName,
    safe: true,
}, consolePretty);

let logPath = path.resolve(process.cwd(), setting.logPath);
let loggerPretty = {
    visiting: null,
    error: null,
    server: null
};

let loggerAppender = {
    visiting: noop,
    error: noop,
    server: noop
};

// create path
if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

// create log files and init loggerAppender
LOG_TYPE.map((item, index)=> {
    if (!fs.existsSync(logPath + '/' + item + '.log')) {
        fs.openSync(logPath + '/' + item + '.log', 'w');
    }

    loggerPretty[item] = pretty();
    loggerPretty[item].pipe(fs.createWriteStream(logPath + '/' + item +'.log'));
    loggerAppender[item] = pino({
        name: logName,
        safe: true
    }, loggerPretty[item]);
});


let mode = global.mode;

module.exports = {
    info: (msg)=> {
        if (mode === 'dev') {
            consoleAppender.info(msg);
        }

        loggerAppender.visiting.info(msg);
    },
    error: (msg)=> {
        if (mode === 'dev') {
            consoleAppender.error(msg);
        }

        loggerAppender.error.error(msg);
    },
    warn: (msg)=> {
        if (mode === 'dev') {
            consoleAppender.warn(msg);
        }

        loggerAppender.error.warn(msg);
    },
    debug: (msg)=> {
        consoleAppender.debug(msg);
    },
    // server start log
    start: (msg)=> {
        if (mode === 'dev') {
            consoleAppender.info(msg);
        }

        loggerAppender.server.info(msg);
    }
};
