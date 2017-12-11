// Copyright 2017 FOCUS Inc.All Rights Reserved.

/**
 * @description 按照配置顺序优先级匹配正确的规则
 * @fileOverview koa-ice
 * @author oneroundseven@gmail.com
 */

const proxy = require('../setting').proxy;
const {URL} = require('url');

let _hosts = function() {};

let myURL;
let filter;

function hosts(urlString) {
    myURL = new URL(urlString);

}

function match(domain, path) {
    proxy.map((app, index)=> {
        if (app.domain === domain && app.filter) {
            filter = new RegExp(app.filter);
            filter.match()
        }

        //if (app.filter.match)
    })
}

module.exports = _hosts;
