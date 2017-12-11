#!/usr/bin/env node
// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const program = require('commander');
const setting_dev = require('./setting_dev');
const setting_release = require('./setting_release');
const setting_test = require('./setting_test');
let setting = setting_dev;

program
    .version('0.1.0')
    .option('-d, --dev', 'dev env')
    .option('-t, --test', 'test env')
    .option('-r, --release', 'prod env')
    .parse(process.argv);

if (program.dev)  {
    setting = setting_dev;
    global.mode = 'dev';
}
if (program.test) {
    setting = setting_test;
}
if (program.release) {
    setting = setting_release;
}

module.exports = setting;

