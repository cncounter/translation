# 如何从kibana批量提取日志


## 1.获取日志内容

打开Kibana页面搜索日志, 执行查询， 

开启 Network网络控制台;

执行查询，刷新。

从网络请求日志中找到类似的请求记录:

> https://logkibana.cncounter.com/internal/bsearch?compress=true

将请求和数据拷贝为 cURL 脚本，

然后把 `compress=true` 修改为 `compress=false`

在命令行执行查询。

接着处理返回结果, 提取包含 日志信息的 json 内容赋值给 resp 变量【参考下方脚本】.



## 2. 处理Kibana日志的js脚本


```lang=js
var resp = {}; 
// 这里需要处理并将正确的JSON内容赋值给 resp 变量。
// var resp={};
var messages = [];
var hits = resp.result.rawResponse.hits.hits ;
hits.forEach(function(v, i){
  var timestamp= v.fields["@timestamp"][0];
  var message = v.fields.message;
  messages.push(timestamp+" : "+message);
});
// 拷贝到剪贴板。
copy(messages.join("\n"));

```

根据需要修改脚本中的字段内容。

## 3. Chrome控制台执行脚本

处理完成脚本后， 打开 Chrome  的console 控制台， 粘贴并执行脚本即可。

处理结果通过 copy 函数存放到剪贴板之中， 在需要的地方粘贴即可。





