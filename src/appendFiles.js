// 根据配置写入文件
const fs = require('fs-extra');
const store = require('./store');
const version = require('../package.json').version;

// index.html模板文件
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
  	<meta http-equiv="X-UA-Compatible" content="ie=edge">
  	<title>${store.dirname}</title>
</head>
<body>
	<p>zys-cli  v${version}</p>
</body>
</html>
`;

// index.pug 模板文件
const pugTemplate = `<!DOCTYPE html>
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    meta(http-equiv="X-UA-Compatible", content="ie=edge")
    title zys v${version}
  body
    p zys v${version}
`;

const entry = [
	`./src/scripts/index.${store.options.typescript ? 'ts' : 'js'}`,
	`./src/styles/index.${store.options.precss}`,
	`normalize.css`
];
if (store.options.mobileLayout) {
	entry.push('hotcss');
};

// 配置文件模板
const configTemplate = `module.exports = {
	// 入口文件
	entry: [\n    '${entry.join("',\n    '").toString()}'\n  ],
	// pug: ${store.options.pug},
	eslint: ${store.options.eslint},
	babel: ${store.options.babel},
	typescript: ${store.options.typescript},
	// 设计稿宽度
	designWidth: ${store.options.mobileLayout ? 750 : 0},
};`;

// package.json
const packageTemplate = `{
	"name": "${store.dirname}",
	"version": "0.1.0",
	"scripts": {
		"serve": "cross-env NODE_ENV=serve zys-service",
		"build": "cross-env NODE_ENV=build zys-service",
		"test": "jest --coverage"
	},
	"license": "ISC"
}`;

// tsconfig.json
const tsTemplate = `{
	"compilerOptions": {
        "outDir": "./dist/",
        "noImplicitAny": true,
        "module": "es6",
        "target": "es5",
        "jsx": "react",
        "allowJs": true
    }
}`;

/**
 * 遍历创建文件
 * @params {string} dest 相对路径 + 文件名
 * @params {string} temp 文件模板
*/
const htmlEx = store.options.pug ? 'pug' : 'html';
const configList = [
	{// 创建配置文件
		dest: `./${store.dirname}/zys.config.js`,
		temp: configTemplate
	},
	{ // 通过选项创建 html 或 pug 文件
		dest: `./${store.dirname}/src/index.${htmlEx}`,
		temp: store.options.pug ? pugTemplate : htmlTemplate,
	},
	{ // 创建package.json文件
		dest: `./${store.dirname}/package.json`,
		temp: packageTemplate,
	}
];

// 创建ts配置文件
if (store.options.typescript) {
	configList.push({
		dest: `./${store.dirname}/tsconfig.json`,
	  	temp: tsTemplate,
	});
}
  
module.exports = function appendFiles() {
	configList.forEach(item => {
	  	fs.appendFileSync(
			item.dest,
			item.temp,
			{
		  		flag: 'w'
			}
	  	);
	});
	fs.rename(`./${store.dirname}/src/styles/index.css`, `./${store.dirname}/src/styles/index.${store.options.precss || 'css'}`);
	fs.rename(`./${store.dirname}/src/scripts/index.js`, `./${store.dirname}/src/scripts/index.${store.options.typescript ? 'ts' : 'js'}`);
};