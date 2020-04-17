// 初始化创建步骤选项列表  
const { inquirerList, inquirerPrecssList, options, dependencies} = require('./store');
const inquirer = require('inquirer');
const store = require('./store');  

module.exports = async function() {
	const answerStep = [];
	const submenu = ['precss'];
	await inquireBase(answerStep, submenu);
	await hasPrecss(answerStep);
	require('./creator')();
}

// 一级菜单，基本选项
function inquireBase(answerStep, submenu) {
	return new Promise(resolve => {
		const inquireOptions = inquirer.createPromptModule();
		inquireOptions(inquirerList).then(answers => {
			submenu.forEach(item => {
				if (answers.options.includes(item)) {
					answerStep.push(item);
				}
			});
			answers.options.forEach(item => {
				if (store.options[item] === false) {
					store.options[item] = true;
				}
				if (!answerStep.includes(item) && item in dependencies) {
					options.dependencies = [...options.dependencies, ...dependencies[item]];
				}
			})
			resolve();
		})
	})
}

// 二级菜单 css 预处理器
function hasPrecss(answerStep) {
	return new Promise((resolve, reject) => {
		if (answerStep.includes('precss')) {
			const inquirePrecss = inquirer.createPromptModule();
			inquirePrecss(inquirerPrecssList).then(answers => {
				store.options.precss = answers.Precss;
				options.dependencies = [...options.dependencies, ...dependencies[answers.Precss]];
				resolve()
			})
		}else {
			resolve();
		}
	})
}
