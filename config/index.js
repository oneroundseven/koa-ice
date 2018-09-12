// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
const SUMMERS_CONFIG_FILE = 'summers-ice-default.js';
const HOST_TAG = 'host';

const path = require('path');
const fs = require('fs');
const { warn, error, info } = require('../src/debug');

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
let fileDir, directDir;
info('scanDir from '+ settings.staticPath);
let files =  fs.readdirSync(settings.staticPath);
files.forEach((fileName, index)=> {
    if (settings.mockIgnore.indexOf(fileName) === -1) {
        fileDir = path.join(settings.staticPath, fileName);
        let stats = fs.statSync(fileDir);
        if (stats && stats.isDirectory()) {
            directDir = path.join(settings.staticPath, fileName);
            fileDir = path.join(directDir, settings.config);
            if (fs.existsSync(fileDir)) {
                info('Find hosts file from '+ directDir);
                try {
                    let content = fs.readFileSync(fileDir, { encoding: 'utf-8' });
                    serialProperties(content, directDir);
                } catch (err) {
                    console.error('Trans properties Error:' + err);
                }
            }
        }
    }
});

function serialProperties(content, directDir) {
    if (!content || content.length === 0) return null;

    let matchResult, host = {}, hostTmp = {}, hostConfig;

    content.split('\r\n').forEach((property)=> {
        matchResult = property.match(/(.*?)=(.*?)(\s|$)/);
        if (matchResult && matchResult.length > 3) {
            if (matchResult[1] === HOST_TAG) {
                try {
                    hostTmp = {};
                    hostConfig = matchResult[2].split('|');
                    let tmpPath = path.join(directDir, '/'+ hostConfig[0]);
                    hostTmp.domain = hostConfig[1];
                    hostTmp.view = path.join(tmpPath, (hostConfig.length === 3 ? hostConfig[2] : '/view'));
                    hostTmp.api = path.join(tmpPath, (hostConfig.length === 4 ? hostConfig[3] : '/api'));
                    addHost(hostTmp);
                } catch (err) {
                    info('Multiple host Error:'+ property + err);
                    throw JSON.stringify(matchResult);
                }
            } else {
                host[matchResult[1]] = matchResult[2]
            }
        }
    });

    if (!host.api) {
        host.api = path.join(directDir, '/api');
    }

    if (!host.view) {
        host.view = path.join(directDir, '/view');
    }

    hostTmp = null;
    addHost(host);
}

/**
 * 过滤重复存在的配置 按照读取顺序覆盖 (domain去重)
 */
function addHost(newHost) {
    if (!newHost) return;

    for (let i = 0; i < hosts.length; i++) {
        if (hosts[i].domain === newHost.domain) {
            warn('Duplicate: '+ JSON.stringify(hosts[i]) + '=> Override by' + JSON.stringify(newHost));
            hosts.splice(i, 1);
            break;
        }
    }

    hosts.push(newHost);
}

fileDir = null;

hosts.forEach(host=> {
    info('Mock Info:'+ JSON.stringify(host));
});

settings.hosts = hosts;
module.exports = settings;

