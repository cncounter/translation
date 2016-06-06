The HTML specification introduces a `[crossorigin](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin)` attribute for images that, in combination with an appropriate [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS) header, allows images defined by the [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) element loaded from foreign origins to be used in canvas as if they were being loaded from the current origin.

See [CORS settings attributes](https://developer.mozilla.org/en/HTML/CORS_settings_attributes) for details on how the `crossorigin` attribute is used.

## What is a "tainted" canvas?

Although you can use images without CORS approval in your canvas, doing so **taints** the canvas. Once a canvas has been tainted, you can no longer pull data back out of the canvas. For example, you can no longer use the canvas `toBlob()`, `toDataURL()`, or `getImageData()` methods; doing so will throw a security error.

This protects users from having private data exposed by using images to pull information from remote web sites without permission.

## Example: Storing an image from a foreign origin

You must have a server hosting images with the appropriate `Access-Control-Allow-Origin` header.  Adding crossOrigin attribute makes a request header. You can use this excerpt from the [HTML5 Boilerplate Apache server configs](https://github.com/h5bp/server-configs-apache/blob/fc379c45f52a09dd41279dbf4e60ae281110a5b0/src/.htaccess#L36-L53) to appropriately respond with this response header:

```
<IfModule mod_setenvif.c>
    <IfModule mod_headers.c>
        <FilesMatch "\.(cur|gif|ico|jpe?g|png|svgz?|webp)$">
            SetEnvIf Origin ":" IS_CORS
            Header set Access-Control-Allow-Origin "*" env=IS_CORS
        </FilesMatch>
    </IfModule>
</IfModule> 

```

Given that's all sorted, you will be able to save those images to [DOM Storage](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage) as if they were served from your domain.

```
var img = new Image,
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    src = "http://example.com/image"; // insert image url here

img.crossOrigin = "Anonymous";

img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage( img, 0, 0 );
    localStorage.setItem( "savedImageData", canvas.toDataURL("image/png") );
}
img.src = src;
// make sure the load event fires for cached images too
if ( img.complete || img.complete === undefined ) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
}
```

## Browser compatibility


## See Also

*   [Using Cross-domain images in WebGL and Chrome 13](http://blog.chromium.org/2011/07/using-cross-domain-images-in-webgl-and.html)

*   [HTML Specification - the `crossorigin` attribute](http://whatwg.org/html#attr-img-crossorigin)



原文链接: [https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
