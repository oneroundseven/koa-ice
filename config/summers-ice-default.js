// Copyright 2018 FOCUS Inc.All Rights Reserved.

/**
 * @fileOverview summers-ice
 * @author oneroundseven@gmail.com
 */

module.exports = {
    port : 9098, // 应用端口
    logPath : 'logs', // 设置日志存放位置， 默认为当前命令执行路径下 /logs 文件夹内
    debug : true, // 是否开启调试模式，不开启默认错误日志会存储到日志文件中，开发模式默认开启 并调用domi模块模拟数据

    staticPath: null, // 静态资源源文件路径 默认为当前命令执行路径
    staticExpires: 10, // 静态资源缓存过期时间，默认为10天
    staticCompilePath: null, // 静态资源编译后的文件存储路径, 默认为当前命令执行路径/target
    staticCompileFilter: ['jpg', 'png', 'gif', 'pdf', 'html'], // 配置哪些静态资源不走编译后的文件

    config: 'hosts.properties' // mock 配置文件 (当前命令执行路径下的每个文件夹中独立配置，有则纳入mock模拟)
};