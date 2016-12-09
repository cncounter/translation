# 防止抖动；防止短时间内重复点击等


演示地址: [http://www.cncounter.com/test/notMultiClick/notMultiClick.html](http://www.cncounter.com/test/notMultiClick/notMultiClick.html)



实现代码:

> notMultiClick.js


```
/*
 // 使用示例
 notMultiClick($("#btn1"), function(){
  // 处理逻辑 。。。
  console.dir("clicked at:" + new Date());
 });
 */
// notMultiClick(jQuery对象, handler, 禁止重复点击的秒数)
// 防止抖动；防止短时间内重复点击等
function notMultiClick($dom, handler, seconds){
    if(!$dom || !$dom.click || !handler){return;}
    // 将数据存到 data-属性上
    var data_key_inHandling = "in_click_handling";
    // 禁止重复点击的时间-秒
    seconds = seconds || 1;
    // 绑定事件, 其实可以包装一下,绑定各种事件
    $dom.click(handlerProxy);
    //
    function handlerProxy(){
        //
        var $this = $(this);
        // 判断是否处于抖动期
        if(isInHandling($this)){
            return;
        }
        // 设置正在处理中
        setInHandling($this);
        // 自动移除禁止状态
        timeoutRemoveInHandling($this, seconds);
        // 执行
        handler.apply(this, arguments);

    };
    // 判断是否正在处理之中
    function isInHandling($this){
        var inHandling = $this.data(data_key_inHandling);
        if(inHandling){
            return true;
        }
        return false;
    };
    // 设置处于处理过程中
    function setInHandling($this){
        var timestamp = new Date().getTime();
        $this.data(data_key_inHandling, ""+timestamp);
        // 其实可以设置禁止点击-disable
    };
    //
    function timeoutRemoveInHandling($this, seconds){
        window.setTimeout(function(){
            $this.removeData(data_key_inHandling);
            // 其实可以设置禁止点击-disable
        }, seconds * 1000);
    };

};
```


测试代码:

```
<html>
<head>
	<script src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
	<script type="text/javascript" src="notMultiClick.js"></script>
	<script type="text/javascript">
	$(function(){
		notMultiClick($("#btn1"), function(){
			var log = "<br/>" + "<span>" + "clicked at:" + new Date() + "</span>";
			var currLog = $("#logs").html() || "";
			$("#logs").html(currLog + log);
		});
	});
	</script>
</head>
<body>
	<button id="btn1">测试重复点击</button><br />
	<div id="logs"></div>
</body>
</html>
```

