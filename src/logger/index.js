// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
process.env.DEBUG = 'SUMMER-ICE:* ';

const debugPlug = require('debug');
const summerUtil = require('summers-util');
let logger = summerUtil.getLog();

const warn = debugPlug('SUMMER-ICE:Warning');
warn.color = 3;
const info = debugPlug('SUMMER-ICE:Info');
info.color = 0;
const error = debugPlug('SUMMER-ICE:Error');
error.color = 41;
const debug = debugPlug('SUMMER-ICE:Debug');
debug.color = 6;

module.exports = {
    warn: (content)=> { logger ? logger.warn(content) : warn(content);},
    info: (content)=> { logger ? logger.info(content) : info(content); },
    error: (content)=> { logger ? logger.error(content) : error(content); },
    debug: (content)=> { logger ? logger.debug(content) : debug(content); }
};