// express参考API: http://expressjs.com/en/api.html

// 模块依赖
var http = require('http');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
// 端口号
const http_port = 80;
// express服务实例
const server = express();
//
const printpdf = require('./printpdf.js');

// mount 事件
server.on('mount', function (parent) {
  console.log('Server Mounted:', parent);
});

// 中间件模式
server.use(function(request, response, next){
  console.log("request.url="+request.url);
  //console.log("request.headers=", request.headers);
  next();
});

// 中间件模式
server.use(function(request, response, next){
  request.random = Math.random();
  request.date = new Date();//.getTime();
  next();
});

// 最后可以加上: 错误处理器
server.use(function errorHandler(err, request, response, next){
    console.error('something bad happened', err);
    response.status(500).send('Server-Error:' + err);
});

// 注册模板引擎: (扩展名, 处理函数)
server.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
server.set('view engine', '.hbs');
server.set('views', path.join(__dirname, 'views'));

// 请求 Mapping
// get, post, put, all 等

server.all('*', function requireAuth(request, response, next){
    // 校验
    //
    next();
});

//
server.get('/', function(request, response){
    // view_name, data
    response.render('home', {
      name: 'John',
      date: request.date
    });
});
//
server.get('/random.json', function(request, response){
   //response.end('Hello From Express!');
   response.json({
     message : "Hello From Express!",
     random: request.random
   });
});

//
server.get('/pdf.json', function(request, response){
    // express 包装的参数
    var params = request.query;
    // 请求URL
    var url = params.url;
    // 文件保存路径
    var path = params.path;
    // 文件名称
    var filename = params.filename;
    // 回调地址
    var callback = params.callback;
    //
    var startMillis = new Date().getTime();

    //
    var config = {
        url : url,
        path : path,
        callback : callback
    };
    var promise = printpdf.printpdf(config);
    //
    promise.then(function(){
        //
        var successMillis = new Date().getTime();
        var costMillis = successMillis - startMillis;
        //
        console.log("costMillis=", costMillis);
        //  加上成功标识
        // 回调通知
        callback && http.get(callback, function(resp){
            let data = '';
              // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
                data = data.trim();
            });
            resp.on('end', () => {
                console.log("request:"+callback, ";statusCode=", resp.statusCode);
                console.log("data="+data);
            });
        });
    }).catch(function(err){
        //
        console.error(err);
        //  加上错误消息
        // 回调通知
        callback && http.get(callback, function(resp){
            let data = '';
              // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
                data = data.trim();
            });
            resp.on('end', () => {
                console.log("request:"+callback, ";statusCode=", resp.statusCode);
                console.log(data);
            });
        });
    });

    //response.end('Hello From Express!');
    response.json(params);
});


// 启动监听
server.listen(http_port, function(err){
  if (err) {
    // 如果启动时发生错误:
    return console.error('something bad happened', err);
  }
  console.log(`server is listening on ${http_port}`);
});

//
