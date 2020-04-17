#!/usr/bin/env node
const {
	spawn
} = require('child_process');
const os = require('os');
const clearConsole = require('../src/clear');

const devCommand = './node_modules/.bin/webpack-dev-server';
const prodCommand = './node_modules/.bin/webpack';
// const devArg = '--config ./node_modules/x-build/service/webpack/webpack.dev.js';
// const prodArg = '--config ./node_modules/x-build/service/webpack/webpack.prod.js';
// 要先把zys 发布到npm上，不然测试安装的zys模块找不到对应的webpack配置文件
const devArg = '--config ./node_modules/zys/service/webpack/webpack.dev.js';
const prodArg = '--config ./node_modules/zys/service/webpack/webpack.prod.js';
  
let command = process.env.NODE_ENV === 'serve' ? devCommand : prodCommand;
let arg = process.env.NODE_ENV === 'serve' ? devArg : prodArg;
  
if (os.type() === 'Windows_NT') {
	command = command.replace(new RegExp('/', 'g'), '\\');
	arg = arg.replace(new RegExp('/', 'g'), '\\');
}
clearConsole('cyan', `zys v${require('../package.json').version}`);
spawn(command, [arg], {
	stdio: 'inherit',
	shell: true,
	detached: false
});