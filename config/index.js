// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
const SUMMERS_CONFIG_FILE = 'summers-ice-default.js';

const path = require('path');
const fs = require('fs');

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
    settings.staticPath = path.resolve(settings.staticPath);
} else {
    settings.staticPath = process.cwd();
}

let domiConfig = [];
let fileDir;

fs.readdir(settings.staticPath, (err, files)=> {
    files.forEach((fileName)=> {
        if (!fileName.startsWith('.') && fileName !== 'node_modules') {
            fileDir = path.join(settings.staticPath, fileName);
            fs.stat(fileDir, (err, stats)=> {
                if (err) {
                    console.warn('Get File Info Error:'+ fileDir);
                } else {
                    if (stats.isDirectory()) {
                        fileDir = path.join(settings.staticPath, fileName, settings.domiConfig);
                        if (fs.existsSync(fileDir)) {
                            try {
                                let content = fs.readFileSync(fileDir, { encoding: 'utf-8' });
                                domiConfig.push(serialProperties(content))
                            } catch (err) {
                                console.error('Trans properties Error:' + fileDir);
                            }
                        }
                    }
                }
            })
        }

    });
});

function serialProperties(content) {
    let result = {};
    if (!content || content.length === 0) return result;

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

settings.domiConfig = domiConfig;
module.exports = settings;

