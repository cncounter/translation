# JavaScript Copy to Clipboard

# JavaScript 复制到剪贴板

"复制到剪贴板"(Copy to clipboard) 这个功能我们每天都要用上几十次，但围绕它的客户端 API 却一直很匮乏；一些较老的 API 和浏览器实现，在内容被复制到剪贴板之前，会弹出一个吓人的 "are you sure?"(你确定吗？)风格的对话框 —— 这对可用性和用户信任都不太友好。大约七年前，[我写过一篇关于 ZeroClipboard 的博客](https://davidwalsh.name/clipboard)，介绍了一种更"新奇"的复制内容到剪贴板的方式……

……说它"新奇"，是因为它用的是 Flash。嘿——如今我们都讨厌 Flash，但功能始终是第一目标，而 Flash 在这件事上确实相当有效，所以不得不承认它是个不错的方案。多年以后，我们有了更好的、不依赖 Flash 的方案： [clipboard.js](https://clipboardjs.com/)。

查看演示

clipboard.js 复制到剪贴板的 API 简短而优雅。下面列出几种用法：

## Copying and Cutting Values of Textarea and Input

## 复制与剪切 Textarea 和 Input 的值

```javascript
/* Textarea - Cut
<textarea id="bar">hello</textarea>
<button class="copy-button" data-clipboard-action="cut" data-clipboard-target="#bar">Cut</button>
*/
var clipboard = new Clipboard('.copy-button');

/* Input - Copy
<input id="foo" type="text" value="hello">
<button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#foo">Copy</button>
*/
var clipboard = new Clipboard('.copy-button');
```

## Copying Element innerHTML

## 复制元素的 innerHTML

```javascript
/* HTMLElement - Copy
<div id="copy-target">hello</div>
<button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#copy-target">Copy</button>
*/
var clipboard = new Clipboard('.copy-button');
```

## `Target` and `Text` Functions

## `Target` 与 `Text` 函数

```javascript
// Contents of an element
var clipboard = new Clipboard('.copy-button', {
    target: function() {
        return document.querySelector('#copy-target');
    }
});

// A specific string
var clipboard = new Clipboard('.copy-button', {
    text: function() {
        return 'clipboard.js is awesome!';
    }
});
```

## Events

## 事件

```javascript
var clipboard = new Clipboard('.btn');

clipboard.on('success', function(e) {
    console.log(e);
});

clipboard.on('error', function(e) {
    console.log(e);
});
```

查看演示

没有 Flash、API 简单，并且能在所有主流浏览器中工作，让 clipboard.js 成为 Web 及其用户的一大胜利。用 Flash 在客户端"垫"功能的日子结束了 —— Web 技术万岁！




<https://davidwalsh.name/clipboard>
