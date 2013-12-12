elementize
==========

[![browser support](https://ci.testling.com/mmckegg/elementize.png)](https://ci.testling.com/mmckegg/elementize)

Convert HTML into an array of DOM Elements

[![NPM](https://nodei.co/npm/elementize.png?compact=true)](https://nodei.co/npm/elementize/)

## Example

```js
var elementize = require('elementize')
var elements = elementize('<html><head><title>Test</title></head><body><div>Content</div></body></html>')
elements[0].nodeName //= HTML
elements[0].children[0].nodeName //= HEAD
```

```js
var elementize = require('elementize')
var elements = elementize('Test 123 <span>Stuff</span> more text')
elements[0].nodeName //= #text
elements[1].nodeName //= SPAN
elements[2].nodeName //= #text
```

```js
var elementize = require('elementize')
var element = elementize.first('  <div>first element, text nodes ignored</div>  <div>Extra</div>')
element.outerHTML //= <div>first element, text nodes ignored</div>
```