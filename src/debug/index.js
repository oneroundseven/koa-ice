// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
process.env.DEBUG = 'SUMMER-ICE:* ';

const debug = require('debug');
const logger = require('../logger');

const warn = debug('SUMMER-ICE:Warning');
const info = debug('SUMMER-ICE:Info');
const error = debug('SUMMER-ICE:Error');
const compile = debug('SUMMER-ICE:Compile');

module.exports = {
    warn: (content)=> { warn(content); logger.server(content); },
    info: (content)=> { info(content); logger.server(content); },
    error: (content)=> { error(content); logger.server(content); },
    compile: (content)=> { compile(content); logger.info(content); }
};