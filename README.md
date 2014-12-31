strip-comment
=============

Strip js, css, and html comments.
## Install
```
npm install strip-comment --save-dev
```
## demo
```html
<style>
p {
    color: red;
    /* Css line comment */
    text-align: center;
}
/*
 * Css block comment 
 */
</style>
<!-- html comment -->
<p>This is a paragraph.</p>
// html content

<script>
/*
 * Js block comemnt
 */
function displayMsg() {
  // Js line comment
  alert("Hello World!")
}
</script>

```
```js
var fs = require('fs');
var html = fs.readFileSync('./index.html', { encoding: 'utf8' });
var strip = require('strip-comment');

strip(html);  // Strip js css and html comments.
```
## API
### .js
```js
var js = 'var a = 3; // comment'
strip.js(js);
strip.js(js, true);     // keep code lines
```

### .css
```js
var css = 'h2 { /* comment */ font-size : 18px; }'
strip.css(css);
```

### .html
```js
var html = '<!-- html comment --><div></div>'
strip.html(html);
```
