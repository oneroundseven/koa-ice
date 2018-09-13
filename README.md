### summers-ice
静态服务及支持本地mock数据

需要支持mock的文件夹需要再根文件夹下增加 hosts.properties
默认会在node执行路径下的所有文件夹中查找

````
domain=www.made-in-china.com
view={viewPath}
host={filePath}|domain|viewPath
````

- domain: 必填，用于mock数据的域名访问和文件夹对应
- view: 选填, 用于指定html等dom结构文件所在路径, 默认不填则为根目录
- host: 选配，统一全局配置 单一文件指定所有配置，可以跟 domain单独配置混用，后配置的会覆盖已配置信息

PS: hosts.properties 文件目前支持根目录配置或者根目录下一级文件夹中配置，不支持层级超过一级的配置

##### 全局配置项

````
module.exports = {
    port : 9098, // 应用端口
    debug : true, // 是否开启调试模式，不开启默认错误日志会存储到日志文件中，开发模式默认开启 并调用domi模块模拟数据

    staticPath: '/example', // 静态资源源文件路径 默认为当前命令执行路径  (相对路径)
    staticExpires: 10, // 静态资源缓存过期时间，默认为10天
    staticTargetPath: null, // 静态资源编译后的文件存储路径, 默认为当前staticPath路径/target  (相对路径)

    config: 'hosts.properties', // mock 配置文件 (当前命令执行路径下的每个文件夹中独立配置，有则纳入mock模拟)
    mockOverTime: 10, // 本地模拟数据请求超时时间设置 默认10s
    mockIgnore: ['.idea', 'node_modules', 'logs', '.git', '.svn', 'target'], // mock配置忽略哪些文件夹

    blackList: ['192.168.31.*'] // 访问黑名单
};
````


#### 使用

````
const SummerICE = require('summers-ice');

SummerICE.start([summerCompiler]);
````