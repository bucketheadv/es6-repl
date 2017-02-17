#!/usr/bin/env node --harmony

var REPL = require('repl')
var co = require('co')
var vm = require('vm')
global.___CO___ = require('co')
global.___CALLBACK___ = function () { }
global.require = require

function processCmd(cmd) {
  cmd = cmd.replace(/\s{2,}/g, ' ').trim()
  const declares = ['let', 'var', 'const']
  for (let d of declares) {
    let starts = d + ' '
    if (cmd.startsWith(starts)) {
      cmd = cmd.slice(starts.length, cmd.length)
      return cmd
    }
  }
  return cmd
}

function coEval(cmd, context, filename, callback) {
  cmd = processCmd(cmd)
  if (cmd.trim() === '') return callback()
  try {
    // var result = eval(cmd);
    var result = vm.runInThisContext(cmd, context)
    callback(null, result);
  } catch (e) {
    ___CALLBACK___ = callback
    // Wrap with co
    if (cmd.startsWith('*')) {
      cmd = cmd.slice(1, cmd.length)
    }
    var cmdToRun = '___CO___(function*(){___CALLBACK___(null, yield function *() { return (' + cmd + ') }())})()';
    var script = vm.createScript(cmdToRun);
    script.runInThisContext(context);
  }
};

function start(options) {
  var defaultOptions = {
    eval: coEval,
    useColors: true,
    useGlobal: true,
    prompt: 'es6-repl> '
  }
  if (options) {
    for (let op in options) {
      defaultOptions[op] = options[op]
    }
  }
  var repl = REPL.start(defaultOptions);
  require('repl.history')(repl, process.env.HOME + '/.node_history');
  return repl;
}

if (!module.parent) {
  start();
} else {
  module.exports.start = start
}
