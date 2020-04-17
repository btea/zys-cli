// 写入文件，安装依赖
const fs = require('fs-extra');
const chalk = require('./chalk');
const path = require('path');
const {
	spawn
} = require('child_process');
const store = require('./store');
const appendFiles = require('./appendFiles');
const clearConsole = require('./clear');
const packageManagement = require('./packageManagement');

module.exports = function() {
	// cli模板文件路径
	const src = path.resolve(__dirname, '../template');
	// 目标路径
	const dest = path.resolve(process.cwd(), store.dirname);
	clearConsole('cyan', `zys-cli v${require('../package').version}`);
	console.log(`> Creating project in ${chalk.yellow(dest)}`);
  	console.log(`> Installing CLI plugins. This might take a while...`);
	console.log('');
	// console.log('\x1b[31m小师叔，回山了\x1b[0m');
	// 拷贝模板文件
	fs.copy(src, dest).then(() => {
		// 根据选项写入文件
		appendFiles();
		// 执行自动安装依赖
		spawnCmd(dest);
	}).catch(err => {
		console.log(err);
	})
}

/**
 * 安装依赖指令  
 * @params {string} dest 需要执行指令的路径   
 * 
*/
function spawnCmd(dest) {
	// 依赖安装命令
	let _packageManagement = packageManagement();
	let cmdInstall = _packageManagement === 'yarn' ? 'add -D' : 'install -D';
	store.options.dependencies.forEach(item => {
		cmdInstall += `${item.name}@${item.version} `;
	});
	// 使用淘宝镜像
	if (_packageManagement === 'npm') {
		cmdInstall += '--registry=https://registry.npm.taobao.org';
	}
	console.log(cmdInstall);
	const ls = spawn(_packageManagement, [cmdInstall], {
		cwd: dest,
		stdio: 'inherit',
		shell: true
	});
	ls.on('close', code => {
		// 成功安装依赖
		if (code === 0) {
			clearConsole('cyan', `zys v${require('../package').version}`);
			console.log('> Get started with the following commands:');
			console.log('');
			console.log(chalk.white(' $ ') + chalk.blue(`cd ${store.dirname}`));
			console.log(chalk.white(' $ ') + chalk.blue(`${packageManagement() === 'npm' ? 'npm run' : 'yarn'} serve`));
		}
	})
}

