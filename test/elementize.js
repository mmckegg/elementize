require('es5-shim')
var test = require('tape')
var elementize = require('../')

test('parse root html', function(t){
  var html = '<html><head><title>Test</title></head><body><div>Test</div></body></html>'
  var elements = elementize(html)
  t.equal(elements[0].nodeName, 'HTML')
  t.equal(toHTML(elements).toLowerCase(), html.toLowerCase())
  t.end()
})

test('parse head', function(t){
  var html = '<head><title>Test</title></head>'
  t.equal(toHTML(elementize(html)).toLowerCase(), html.toLowerCase())
  t.end()
})

test('parse body', function(t){
  var html = '<body><div>Test</div></body>'
  t.equal(toHTML(elementize(html)).toLowerCase(), html.toLowerCase())
  t.end()
})

test('parse body and head', function(t){
  var html = '<head><title>Test</title></head><body><div>Test</div></body>'
  var elements = elementize(html)
  t.equal(elements[0].nodeName, 'HEAD')
  t.equal(elements[1].nodeName, 'BODY')
  t.equal(toHTML(elements).toLowerCase(), html.toLowerCase())
  t.end()
})

test('text nodes with content', function(t){
  var html = 'Test 123 <span>Stuff</span> more text'
  var elements = elementize(html)
  t.equal(elements[0].nodeName, '#text')
  t.equal(elements[1].nodeName, 'SPAN')
  t.equal(elements[2].nodeName, '#text')
  t.equal(toHTML(elements).toLowerCase(), html.toLowerCase())
  t.end()
})

test('parse multiple divs', function(t){
  var html = '<div><span>Test</span></div><div>Another</div>'
  t.equal(toHTML(elementize(html)).toLowerCase(), html.toLowerCase())
  t.end()
})

test('ignore doctype', function(t){
  var html = '<html><head><title>Test</title></head><body><div>Test</div></body></html>'
  t.equal(toHTML(elementize('<!DOCTYPE html>' + html)).toLowerCase(), html.toLowerCase())
  t.end()
})

test('handle node list', function(t){
  var html = 'Test 123 <span>Stuff</span> more text'
  var div = document.createElement('div')
  div.innerHTML = html

  var elements = elementize(div.childNodes)
  t.equal(elements[0].nodeName, '#text')
  t.equal(elements[1].nodeName, 'SPAN')
  t.equal(elements[2].nodeName, '#text')
  t.equal(toHTML(elements).toLowerCase(), html.toLowerCase())
  t.end()
})


function toHTML(elements){
  var html = ''
  for (var i=0;i<elements.length;i++){
    if (elements[i].nodeType === 1){
      html += elements[i].outerHTML
    } else {
      var host = document.createElement('body')
      host.appendChild(elements[i])
      html += host.innerHTML
    }
  }
  return html.replace(/\r\n/g, '')
}