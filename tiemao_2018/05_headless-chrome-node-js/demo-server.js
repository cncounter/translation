// 模块以及端口号
const http = require('http');
const http_port = 80;

// 请求处理器
const requestHandler = (request, response) => {
  console.log("request.url="+request.url);
  response.end('Hello Node.js Server!');
};

// server实例
const server = http.createServer(requestHandler);
// 监听
server.listen(http_port, function(err){
  if (err) {
    return console.error('something bad happened', err);
  }
  console.log(`server is listening on ${http_port}`);
});