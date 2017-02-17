# Es6-repl

Write non-blocking code in a nice-ish way in a node.js repl. Based on [Co](https://github.com/visionmedia/co).

## NOTE

This is an ALPHA version. There are some problems with repl context.

## Install

```
npm install es6-repl
```

## Usage
```js
var repl = require('es6-repl')
repl.start({
  prompt: 'es6-node> ',
  useColors: true
}).on('exit', () => process.exit())
```

In repl,
```js
> var user = yield models.User.findOne()
> user
```
