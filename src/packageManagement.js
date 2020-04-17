const child_process = require('child_process');


/***
 * @description: 检测包管理器 优先级 yarn > cnpm > npm
 * @return {String}
*/
function packageMangement() {
	try {
		child_process.execSync('yarnpkg --version', {stdio: 'ignore'});
		return (_hasYarn = 'yarn');
	}catch(e) {
		return (_hasYarn = 'npm');
	}
}

module.exports = packageMangement;