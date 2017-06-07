# Cross browser to detect tab or window is active so animations stay in sync using HTML5 Visibility API



Hello ..

 

To anyone that needs to [pause()](http://api.greensock.com/js/com/greensock/core/Animation.html#pause()) and [resume() ](http://api.greensock.com/js/com/greensock/core/Animation.html#resume())your GSAP animations when switching browser tabs or windows and have them stay in sync. I did more tests and found that Firefox and Chrome where sometimes not firing the event focus and blur, when you left the active tab.

 

So i found a better way that is consistent,  to check if the current active tab has focus or not, using the [HTML5 Visibility API](https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API).



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



Use the **HTML5 Visibility API** like this:

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

You will still need the following to check if other windows have focus or not (blur). Chromium type browser like Google Chrome or Latest Opera do not fire all the time when binding the event with jQuery window, so you need to check for window.addEventListener.

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

You will also notice that i have a **setTimeout() **in the focus event handler so the tab/window has enough time to gain focus, and so the focus event handler fire consistently. I noticed Firefox and Google Chrome were not resuming correctly unless i added the setTimeout().

 

The reason i use the HTML5 Visibility API is because some browsers like Chrome wont trigger the tab blur unless you actually click inside the other  new tab, simply scrolling with the mouse wont trigger the event,

 

I hope this helps anyone who needs to pause() and resume() their animation so they don't get out of sync.



 

***\*UPDATE****

 

FULL PAGE mode: [http://codepen.io/jonathan/full/sxgJl](http://codepen.io/jonathan/full/sxgJl)

 

EDIT mode: [http://codepen.io/jonathan/pen/sxgJl](http://codepen.io/jonathan/pen/sxgJl)

 

**To Test**, try:

- First clicking inside the Preview panel so the page gains focus (important)
- Switching between tabs
- Giving another program focus and come back to the browser

See [below post](http://forums.greensock.com/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/?view=findpost&p=36317) for more info

 

Also.. I made it into a jQuery plugin called **TabWindowVisibilityManager** so you only have to define your pause() and resume() code once inside the FOCUS and BLUR callbacks. See the [bottom post](http://forums.greensock.com/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/?view=findpost&p=36347).

[TabWindowVisibilityManager.zip](https://greensock.com/forums/applications/core/interface/file/attachment.php?id=2146)



来自 stackoverflow 的答案:



Since originally writing this answer, a new specification has reached *recommendation* status thanks to the W3C. The [Page Visibility API](http://www.w3.org/TR/page-visibility/) now allows us to more accurately detect when a page is hidden to the user.

Current browser support:

- Chrome 13+
- Internet Explorer 10+
- Firefox 10+
- Opera 12.10+ [[read notes](https://dev.opera.com/blog/page-visibility-api-support-in-opera-12-10/)]

The following code makes use of the API, falling back to the less reliable blur/focus method in incompatible browsers.

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

`onfocusin` and `onfocusout` are [required for IE 9 and lower](http://www.thefutureoftheweb.com/blog/detect-browser-window-focus), while all others make use of `onfocus`and `onblur`, except for iOS, which uses `onpageshow` and `onpagehide`.



参考: https://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active


原文链接: https://greensock.com/forums/topic/9059-cross-browser-to-detect-tab-or-window-is-active-so-animations-stay-in-sync-using-html5-visibility-api/









