module.exports = {
    port : '9098', // 应用端口
    logPath : '', // 设置日志存放位置
    debug : 'true', // 是否开启调试模式，不开启默认错误日志会存储到日志文件中，开启后会在控制台再输出一份

    domi: {
        port: ''
    },

    static: {
        port: '9099',
        path: '/resources'
    },

    mail : {
        host : 'mail3.focuschina.com', // default : 127.0.0.1
        port : null, // default : 25
        auth: {
            user: 'sheny@made-in-china.com',
            pass: '15531685'
        }
    }
};