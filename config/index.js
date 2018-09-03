// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
const SUMMERS_CONFIG_FILE = 'summers-ice-default.js';

const path = require('path');
const fs = require('fs');
var debug = require('debug')('app:server');

let settings = require('./'+ SUMMERS_CONFIG_FILE);

// override default setting
let config_dir = process.env.NODE_CONFIG_DIR;
if (config_dir && fs.existsSync(config_dir)) {
    let setting_path = path.resolve(config_dir + '/'+ SUMMERS_CONFIG_FILE);
    if (fs.existsSync(setting_path)) {
        settings = require(setting_path);
    }
}

// domi mock cache mapping
if (settings.staticPath && fs.existsSync(settings.staticPath)) {
    settings.staticPath = settings.staticPath;
} else {
    settings.staticPath = process.cwd();
}

if (settings.staticTargetPath && fs.existsSync(settings.staticTargetPath)) {
    settings.staticTargetPath = settings.staticTargetPath;
} else {
    settings.staticTargetPath = path.join(settings.staticPath, '/target');
}

let hosts = [];
let fileDir;
debug('scanDir from '+ settings.staticPath);
let files =  fs.readdirSync(settings.staticPath);
files.forEach((fileName, index)=> {
    if (!fileName.startsWith('.') && fileName !== 'node_modules') {
        fileDir = path.join(settings.staticPath, fileName);
        let stats = fs.statSync(fileDir);
        if (stats && stats.isDirectory()) {
            fileDir = path.join(settings.staticPath, fileName, settings.config);
            if (fs.existsSync(fileDir)) {
                debug('Find hosts file from '+ path.join(settings.staticPath, fileName));
                try {
                    let content = fs.readFileSync(fileDir, { encoding: 'utf-8' });
                    let serialResult = serialProperties(content);
                    if (serialResult) {
                        hosts.push(serialResult);
                    }
                    debug('Mock Record Dir:'+ path.join(settings.staticPath, fileName) + ' domain='+ (serialResult && serialResult.domain));
                } catch (err) {
                    console.error('Trans properties Error:' + fileDir);
                }
            }
        }
    }
    if (index === files.length - 1) {
        settings.__hostHandle && settings.__hostHandle();
    }
});

function serialProperties(content) {
    let result = {};
    if (!content || content.length === 0) return null;

    let matchResult;

    content.split('\r\n').forEach((property)=> {
        matchResult = property.match(/(.*?)=(.*?)(\s|$)/);
        if (matchResult && matchResult.length > 3) {
            result[matchResult[1]] = matchResult[2]
        }
    });

    return result;
}

fileDir = null;

settings.hosts = hosts;
module.exports = settings;

