// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author sheny@made-in-china.com
 */

const pino = require('pino');
const fs = require('fs');
const setting = require('../setting');
const pretty = pino.pretty();

pretty.pipe(process.stdout);

const logger = pino({
    name: 'koa-ice',
    safe: true
}, pretty);

let logPath = setting.logPath;

if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
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