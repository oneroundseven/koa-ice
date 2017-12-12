#!/usr/bin/env node
// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const program = require('commander');
const path = require('path');
const fs = require('fs');

let setting_dir = __dirname;
let setting = {
    dev: null,
    release: null,
    test: null
};

// pre set setting
for (let cmd in setting) {
    setting[cmd] = require(setting_dir + '/setting_' + cmd + '.js');
}

// override default setting
let run_dir = process.cwd();
if (fs.existsSync(path.resolve(run_dir + '/config'))) {
    let setting_path;
    for (let cmd in setting) {
        setting_path = path.resolve(run_dir + '/config/setting_' + cmd + '.js');
        if (fs.existsSync(setting_path)) {
            setting[cmd] = require(setting_path);
        }
    }
}

program
    .version('0.1.0')
    .option('-d, --dev', 'dev env')
    .option('-t, --test', 'test env')
    .option('-r, --release', 'prod env')
    .parse(process.argv);

let setting_default = setting.dev;

if (program.dev)  {
    setting_default = setting.dev;
    global.mode = 'dev';
}
if (program.test) {
    setting_default = setting.test;
}
if (program.release) {
    setting_default = setting.release;
}

module.exports = setting_default;

