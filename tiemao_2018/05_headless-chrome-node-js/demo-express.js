// express参考API: http://expressjs.com/en/api.html

// 模块依赖
const path = require('path');
const express = require('express');
// 端口号
const http_port = 80;
// express服务实例
const server = express();

// 请求 Mapping
// get, post, put, all 等方法
server.get('/', function(request, response){
    // express 包装的参数
    var params = request.query;
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