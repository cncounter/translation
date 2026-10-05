# 跨浏览器检测窗口/标签页是否处于激活状态



大家好 ..

 

如果你需要在切换浏览器标签页或窗口时 [pause()](http://api.greensock.com/js/com/greensock/core/Animation.html#pause()) 和 [resume() ](http://api.greensock.com/js/com/greensock/core/Animation.html#resume())你的 GSAP 动画, 并让它们保持同步, 那么本文正是为你准备的。我做了更多测试, 发现当离开当前激活的标签页时, Firefox 和 Chrome 有时并不会触发 focus 和 blur 事件。

 

所以我找到了一种更一致的方法, 使用 [HTML5 Visibility API](https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API) 来检测当前激活的标签页是否获得焦点。



```
// main visibility API function 
// use visibility API to check if current tab is active or not
var vis = (function(){
    var stateKey, 
        eventKey, 
        keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();
```



**HTML5 Visibility API** 的用法如下:

```
// check if current tab is active or not
vis(function(){
					
    if(vis()){
	
        // tween resume() code goes here	
	setTimeout(function(){            
            console.log("tab is visible - has focus");
        },300);		
												
    } else {
	
        // tween pause() code goes here
        console.log("tab is invisible - has blur");		 
    }
});
```

要检测其他窗口是否有焦点(blur), 你仍然需要下面的代码。Google Chrome 或最新 Opera 这类 Chromium 内核的浏览器, 在使用 jQuery 绑定 window 事件时并不会始终触发, 所以需要改用 window.addEventListener 来检测。

```
// check if browser window has focus		
var notIE = (document.documentMode === undefined),
    isChromium = window.chrome;
      
if (notIE && !isChromium) {

    // checks for Firefox and other  NON IE Chrome versions
    $(window).on("focusin", function () { 

        // tween resume() code goes here
        setTimeout(function(){            
            console.log("focus");
        },300);

    }).on("focusout", function () {

        // tween pause() code goes here
        console.log("blur");

    });

} else {
    
    // checks for IE and Chromium versions
    if (window.addEventListener) {

        // bind focus event
        window.addEventListener("focus", function (event) {

            // tween resume() code goes here
            setTimeout(function(){                 
                 console.log("focus");
            },300);

        }, false);

        // bind blur event
        window.addEventListener("blur", function (event) {

            // tween pause() code goes here
             console.log("blur");

        }, false);

    } else {

        // bind focus event
        window.attachEvent("focus", function (event) {

            // tween resume() code goes here
            setTimeout(function(){                 
                 console.log("focus");
            },300);

        });

        // bind focus event
        window.attachEvent("blur", function (event) {

            // tween pause() code goes here
            console.log("blur");

        });
    }
}
```

你还会注意到, 我在 focus 事件处理器中使用了 **setTimeout()**, 让标签页/窗口有足够时间获得焦点, 从而让 focus 事件处理器能稳定触发。我发现如果不加 setTimeout(), Firefox 和 Google Chrome 就无法正确恢复动画。

 

我使用 HTML5 Visibility API 的原因是, 像 Chrome 这类浏览器, 除非你真的在另一个新标签页里点击一下, 否则不会触发标签页的 blur 事件; 仅仅用鼠标滚动并不会触发该事件。

 

希望这能帮到那些需要 pause() 和 resume() 动画、避免动画失去同步的人。



 

**更新(UPDATE)**

 

全屏模式(FULL PAGE): [http://codepen.io/jonathan/full/sxgJl](http://codepen.io/jonathan/full/sxgJl)

 

编辑模式(EDIT): [http://codepen.io/jonathan/pen/sxgJl](http://codepen.io/jonathan/pen/sxgJl)

 

**测试方法**, 请尝试:

- 先在预览面板(Preview)内部点击一下, 让页面获得焦点(重要)
- 在标签页之间切换
- 让另一个程序获得焦点, 然后再回到浏览器

更多信息请参考[下面的帖子](http://forums.greensock.com/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/?view=findpost&p=36317)

 

另外, 我把它做成了一个名为 **TabWindowVisibilityManager** 的 jQuery 插件, 这样你只需要在 FOCUS 和 BLUR 回调里各定义一次 pause() 和 resume() 代码即可。请参考[最下面的帖子](http://forums.greensock.com/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/?view=findpost&p=36347)。

[TabWindowVisibilityManager.zip](https://greensock.com/forums/applications/core/interface/file/attachment.php?id=2146)



来自 stackoverflow 的答案:



自最初写下这个答案以来, 得益于 W3C, 一项新规范已经达到 *推荐(recommendation)* 状态。[Page Visibility API](http://www.w3.org/TR/page-visibility/) 现在可以让我们更精确地检测页面何时对用户隐藏。

当前浏览器支持情况:

- Chrome 13+
- Internet Explorer 10+
- Firefox 10+
- Opera 12.10+ [[阅读说明](https://dev.opera.com/blog/page-visibility-api-support-in-opera-12-10/)]

下面的代码使用了该 API, 并在不兼容的浏览器中回退到可靠性较差的 blur/focus 方式。

```
(function() {
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide
    = window.onfocus = window.onblur = onchange;

  function onchange (evt) {
    var v = "visible", h = "hidden",
        evtMap = {
          focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
        };

    evt = evt || window.event;
    if (evt.type in evtMap)
      document.body.className = evtMap[evt.type];
    else
      document.body.className = this[hidden] ? "hidden" : "visible";
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if( document[hidden] !== undefined )
    onchange({type: document[hidden] ? "blur" : "focus"});
})();
```

IE 9 及更低版本[需要使用](http://www.thefutureoftheweb.com/blog/detect-browser-window-focus) `onfocusin` 和 `onfocusout`, 而其他所有浏览器都使用 `onfocus` 和 `onblur`, 唯独 iOS 使用 `onpageshow` 和 `onpagehide`。



参考: https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active


原文链接: https://greensock.com/forums/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/









