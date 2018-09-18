// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
process.env.DEBUG = 'SUMMER-ICE:* ';

const path = require('path');
const debugPlug = require('debug');
const log4js = require('log4js');
let logger;

const warn = debugPlug('SUMMER-ICE:Warning');
warn.color = 3;
const info = debugPlug('SUMMER-ICE:Info');
info.color = 0;
const error = debugPlug('SUMMER-ICE:Error');
error.color = 41;
const debug = debugPlug('SUMMER-ICE:Debug');
debug.color = 6;

// use log4js as logger 如果环境变量配置了NODE_CONFIG_DIR
if (process.env.NODE_CONFIG_DIR) {
    //log4js.configure(path.join(process.env.NODE_CONFIG_DIR || "./config", "log4js.json"));
    //logger = log4js.getLogger("summers-ice");
}

module.exports = {
    warn: (content)=> { logger ? logger.warn(content) : warn(content);},
    info: (content)=> { logger ? logger.info(content) : info(content); },
    error: (content)=> { logger ? logger.error(content) : error(content); },
    debug: (content)=> { logger ? logger.debug(content) : debug(content); }
};