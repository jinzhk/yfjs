#!/usr/bin/env node

var argv = require('optimist').argv, args;

if (!argv._.length) {
	args = process.argv.slice(2);
} else {
	args = argv._;
}

var spawn = require('child_process').spawn;

var cprocess = spawn("node", ["./node_modules/idoc/.bin/idoc.js"].concat(args));

// 子进程的输出导向控制台
cprocess.stdout.pipe(process.stdout);
cprocess.stderr.pipe(process.stdout);