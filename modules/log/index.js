// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author sheny@made-in-china.com
 */

const pino = require('pino');
const pretty = pino.pretty();
pretty.pipe(process.stdout);
const logger = pino({
    name: 'koa-ice',
    safe: true
}, pretty);

module.exports = {
    info: (msg)=> {
        logger.info('test hello');
    },
    warn: (msg)=> {

    }
};