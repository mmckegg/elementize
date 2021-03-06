module.exports = function(html){
  if (!html){
    return []
  } else if (typeof html === 'string'){ // HTML
    return parse(html)
  } else if (Array.isArray(html)){ // Array
    return html
  } else if (html.length != null){ // NodeList
    var result = []
    for (var i=0;i<html.length;i++){
      result.push(html[i])
    }
    return result
  } else if (html.nodeType) { // Node
    if (html.nodeName === '#document'){
      return [html.documentElement]
    } else {
      return [html]
    }
  }
}

module.exports.first = function(html){
  var elements = module.exports(html)
  for (var i=0;i<elements.length;i++){
    if (elements[i].nodeType === 1){
      return elements[i]
    }
  }
  return elements[0]
}

function parse(html){
  var root = getRoot(html)
  if (root){
    return root
  } else {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = html

    // prepare return array
    var result = []
    var current = wrapper.firstChild
    while (current){
      result.push(current)
      current = current.nextSibling
      wrapper.removeChild(result[result.length-1])
    }

    return result
  }
}

function isRoot(html){
  return /^(<!doctype |<html)/i.test(html)
}

function getRoot(html){
  var match = /^(\W*)(<!doctype \w+>)?(\W*)(<html[^>]*>)/i.exec(html)
  if (match){
    var rootElement = getNode(match[4])
    var endIndex = html.lastIndexOf('<')
    var inner = html.slice(match[0].length, endIndex)
    setRootInner(rootElement, inner)
    return [rootElement]
  }

  var rootNodes = getRootNodes(html)
  if (rootNodes.length){
    return rootNodes
  }
}

function setRootInner(rootElement, innerHtml){
  try {
    rootElement.innerHTML = innerHtml
  } catch (ex) {
    // handle silly IE
    var nodes = getRootNodes(innerHtml)
    for (var i=0;i<nodes.length;i++){
      rootElement.appendChild(nodes[i])
    }
  }
}

function getRootNodes(html){
  var result = []
  var headMatch = /(<head[^>]*>)(.+)(<\/head>)/i.exec(html)
  if (headMatch){
    var headElement = getNode(headMatch[1])
    try {
      headElement.innerHTML = headMatch[2]
    } catch (ex) {
      var fakeHead = document.createElement('body')
      fakeHead.innerHTML = headMatch[2]
      for (var i=0;i<fakeHead.childNodes.length;i++){
        headElement.appendChild(fakeHead.childNodes[i])
      }
    }
    result.push(headElement)
  }

  var bodyMatch = /(<body[^>]*>)(.+)(<\/body>)/.exec(html)
  if (bodyMatch){
    var bodyElement = getNode(bodyMatch[1])
    bodyElement.innerHTML = bodyMatch[2]
    result.push(bodyElement)
  }

  return result
}

function getNode(tag){
  var match = /^<(\w+)([^>]*)>/.exec(tag)
  if (match){
    var nodeName = match[1]
    var node = document.createElement(nodeName)

    if (match[2]){
      match[2].replace(/(\w+)(=('(.*)'|"(.*)"|(\w+))|\W|^)/g, function(_, name, a, b, v1, v2, v3){
        node.setAttribute(name, v1||v2||v3||null)
      })
    }

    return node
  }
}
