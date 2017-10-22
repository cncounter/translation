# JavaScript Copy to Clipboard



"Copy to clipboard" functionality is something we all use dozens of times daily but the client side API around it has always been lacking; some older APIs and browser implementations required a scary "are you sure?"-style dialog before the content would be copied to clipboard -- not great for usability or trust.  About seven years back [I blogged about ZeroClipboard](https://davidwalsh.name/clipboard), a solution for copying content to the clipboard in a more novel way...

...and by novel way I mean using Flash.  Hey -- we all hate on Flash these days but functionality is always the main goal and it was quite effective for this purpose so we have to admit it was a decent solution.  Years later we have a better, Flash-free solution:  [clipboard.js](https://clipboardjs.com/).

View Demo

The clipboard.js API for copy to clipboard is short and sweet.  Here are a few uses:

## Copying and Cutting Values of Textarea and Input

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

```javascript
/* HTMLElement - Copy
<div id="copy-target">hello</div>
<button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#copy-target">Copy</button>
*/
var clipboard = new Clipboard('.copy-button');
```

## `Target` and `Text` Functions

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

```javascript
var clipboard = new Clipboard('.btn');

clipboard.on('success', function(e) {
    console.log(e);
});

clipboard.on('error', function(e) {
    console.log(e);
});
```

View Demo

No Flash with a simple API and working in all major browsers makes clipboard.js a huge win for the web and its users.  The days of Flash shimming functionality on the client side are over -- long live web technology!






















<https://davidwalsh.name/clipboard>
