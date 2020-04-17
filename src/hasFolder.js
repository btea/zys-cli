const fs = require('fs');
const chalk = require('./chalk');
function hasFolder(name) {
	return new Promise(resolve => {
		fs.exists(name, exists => {
			if (exists) {
				console.log(name.green() + ' 目录已经存在!');
				process.exit();
			}else {
				// fs.mkdir(name, err => {
				// 	if (err) {
				// 		console.log('创建失败！'.red());
				// 	}else {
				// 		console.log('创建成功！'.green());
				// 	}
				// 	resolve();					
				// })
				resolve();
			}
		})
	})
}

module.exports = hasFolder;