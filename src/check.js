const semever = require('semver');
const chalk = require('./chalk');
const symbol = require('./symbol');
// const request = require('request');
const https = require('https');

function checkNodeVersion (wanted) {
	let v = semever.valid(semever.coerce(process.version))
	// 当前node版本如果小于要求版本，则报错退出
	if (!semever.gt(v, wanted)) {
		let s = `zys-cli 不支持${wanted}以下版本node `;
		console.log(chalk.blue(s) + chalk.red(symbol.cross));
		process.exit();
	}
}
function checkPackageVersion(name, requiredVersion) {
	let url = `https://registry.npmjs.org/${name}/latest`;
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			if (res.statusCode === 200) {
				let datas = ''
				res.on('data', d => {
					datas += d;
				})
				res.on('end', () => {
					datas = JSON.parse(datas);
					let version = datas.version;
					requiredVersion = semever.valid(semever.coerce(requiredVersion));
					if (semever.lte(version, requiredVersion)) {
						resolve();
					}else {
						console.log(`the package ${name} must be update`.red());
					}
				})
			}
		}).on('error', e => {
			reject(e);
		})
	})
}
// checkPackageVersion('vue', '^1.0.0');
module.exports = {
	checkNodeVersion,
	checkPackageVersion
};