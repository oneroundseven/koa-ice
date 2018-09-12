// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const pino = require('pino');
const fs = require('fs');
const util = require('../util');
const setting = require('../../config');
const path = require('path');
const { error } = require('../debug');
const log4js = require('log4js');

/**
 * server: 启动日志
 * visiting: 接口访问日志
 * error: 错误及警告日志
 */
const LOG_TYPE = ['server', 'visiting', 'error'];
let noop = function() {};
let logName = 'summers-ice';

let pretty = ()=> {
    return new pino.pretty({
        formatter: (ori, preFunction)=> {
            let line = '[';
            line += util.formatDate('yyyy-MM-dd hh:mm:ss.SSS') + ']';
            line += '[PID:'+ ori.pid +'] ';
            line += preFunction.asColoredLevel(ori) + ' ';
            line += preFunction.chalk.cyan(ori.msg);
            line += '\r';
            return line;
        }
    });
};
/*
let consolePretty = pretty();
consolePretty.pipe(process.stdout);
const consoleAppender = pino({
    name: logName,
    safe: true,
}, consolePretty);*/

let logPath = path.resolve(process.cwd(), '/logs');
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
    loggerPretty[item].pipe(fs.createWriteStream(logPath + '/' + item +'.log', {
        flags: 'r+'
    }));
    loggerAppender[item] = pino({
        name: logName,
        safe: true
    }, loggerPretty[item]);
});

module.exports = {
    info: (msg)=> {
        try {
            loggerAppender.visiting.info(msg);
        } catch(err) {
            error('Write Log Error:' + err);
        }
    },
    error: (msg)=> {
        try {
            loggerAppender.error.error(msg);
        } catch(err) {
            error('Write Log Error:' + err);
        }
    },
    warn: (msg)=> {
        try {
            loggerAppender.error.warn(msg);
        } catch(err) {
            error('Write Log Error:' + err);
        }
    },
    // server start log
    server: (msg)=> {
        try {
            loggerAppender.server.info(msg);
        } catch(err) {
            error('Write Log Error:' + err);
        }
    }
};

// use log4js as logger, add by xingshikang 2018.9.5
if (process.env.NODE_CONFIG_DIR) {
    log4js.configure(path.join(process.env.NODE_CONFIG_DIR || "./config", "log4js.json"));
    const log= log4js.getLogger("summers-ice");

    module.exports={
        info:function(msg){log.info(msg);},
        error:function(msg){log.error(msg)},
        warn:function(msg){log.warn(msg)},
        server:function(msg){log.info(msg)}
    }
}


