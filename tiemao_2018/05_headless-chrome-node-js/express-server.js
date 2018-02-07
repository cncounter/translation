// express参考API: http://expressjs.com/en/api.html

// 模块依赖
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
// 端口号
const http_port = 80;
// express服务实例
const server = express();

// mount 事件
server.on('mount', function (parent) {
  console.log('Server Mounted:', parent);
});

// 中间件模式
server.use(function(request, response, next){
  console.log("request.url="+request.url);
  console.log("request.headers=", request.headers);
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
