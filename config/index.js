// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const { warn, error, info, debug } = require('../src/logger');

const SUMMERS_CONFIG_FILE = 'summers-ice-default.js';
const HOST_TAG = 'host';

let hosts = [];
let settings = require('./'+ SUMMERS_CONFIG_FILE);

function initialize(summerCompiler) {
    if (global.__hosts) {
        settings.hosts = global.__hosts;
        return settings;
    }

    // override default setting
    let config_dir = process.env.NODE_CONFIG_DIR;
    if (config_dir && fs.existsSync(config_dir)) {
        let setting_path = path.resolve(config_dir + '/'+ SUMMERS_CONFIG_FILE);
        if (fs.existsSync(setting_path)) {
            settings = require(setting_path);
        }
    }

    // domi mock cache mapping
    if (settings.staticPath) {
        if (path.isAbsolute(settings.staticPath)) {
            warn('staticPath config Error:')
        }
        settings.staticPath = path.join(process.cwd(), settings.staticPath);
    } else {
        settings.staticPath = process.cwd();
    }

    if (settings.staticTargetPath && fs.existsSync(settings.staticTargetPath)) {
        settings.staticTargetPath = path.join(process.cwd(), settings.staticTargetPath);
    } else {
        settings.staticTargetPath = path.join(settings.staticPath, '/target');
    }

    // 检查 summerCompiler dist config
    if (summerCompiler && summerCompiler.options.basic.out) {
        settings.staticTargetPath = summerCompiler.options.basic.out;
    }

    let fileDir, directDir, hostContent;
    debug('ScanDir from '+ settings.staticPath.green);
    // 检查执行根目录下是否存在配置文件
    fileDir = path.join(settings.staticPath, settings.config);
    if (fs.existsSync(fileDir)) {
        debug('Find hosts file from '+ settings.staticPath.green);
        hostContent = fs.readFileSync(fileDir, { encoding: 'utf-8' });
        serialProperties(hostContent, settings.staticPath);
    }

    // 检查所有一级文件夹
    let files =  fs.readdirSync(settings.staticPath);
    files.forEach((fileName, index)=> {
        if (settings.mockIgnore.indexOf(fileName) === -1) {
            fileDir = path.join(settings.staticPath, fileName);
            let stats = fs.statSync(fileDir);
            if (stats && stats.isDirectory()) {
                directDir = path.join(settings.staticPath, fileName);
                fileDir = path.join(directDir, settings.config);
                if (fs.existsSync(fileDir)) {
                    debug('Find hosts file from '+ directDir.green);
                    try {
                        hostContent = fs.readFileSync(fileDir, { encoding: 'utf-8' });
                        serialProperties(hostContent, directDir);
                    } catch (err) {
                        error('Trans properties Error:' + err);
                    }
                }
            }
        }
    });

    fileDir = null;
    hosts.forEach(host=> {
        debug('Mock Info: ' + ('http://'+ host.domain).magenta +
            ' API: ' + path.relative(process.cwd(), host.api).green +
            ' VIEWS: '+ path.relative(process.cwd(), host.view).green);
    });

    settings.hosts = hosts;
    global.__hosts = hosts;
    return settings;
}

function serialProperties(content, directDir) {
    if (!content || content.length === 0) return null;

    let matchResult, host = {}, hostTmp = {}, hostConfig;

    content.split('\r\n').forEach((property, line)=> {
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
                    hostTmp.viewLine = line;
                    hostTmp.apiLine = line;
                    addHost(hostTmp, directDir);
                } catch (err) {
                    info('Multiple host Error:'+ property + err);
                    throw JSON.stringify(matchResult);
                }
            } else {
                host[matchResult[1]] = matchResult[2]
                if (matchResult[1] === 'api') {
                    host.apiLine = line;
                }
                if (matchResult[1] === 'view') {
                    host.viewLine = line;
                }
            }
        }
    });

    if (!host.api) {
        host.api = path.join(directDir, '/api');
        host.apiLine = -1;
    }

    if (!host.view) {
        host.view = path.join(directDir, '/view');
        host.viewLine = -1;
    }

    hostTmp = null;
    addHost(host, directDir);
}

/**
 * 过滤重复存在的配置 按照读取顺序覆盖 (domain去重)
 */
function addHost(newHost, directDir) {
    if (!newHost) return;

    for (let i = 0; i < hosts.length; i++) {
        if (hosts[i].domain === newHost.domain) {
            warn('Duplicate domain: ' +  ('http://'+ hosts[i].domain).grey + ', Config Will Override by ' +
                path.join(directDir, settings.config).toString().green + ' ' + ('Line:'+ newHost.apiLine).underline.red);
            hosts.splice(i, 1);
            break;
        }
    }

    hosts.push(newHost);
}

module.exports = initialize;

