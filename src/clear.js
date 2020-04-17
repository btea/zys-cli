const readline = require('readline');
const store = require('./store');
const chalk = require('./chalk');

function clearConsole(color, str) {
	if (process.stdout.isTTY && store.cmd !== 'test') {
		const blank = `\n`.repeat(process.stdout.rows);
		console.log(blank);
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
		console.info(chalk[color](str));
	}
}
// clearConsole('red', 'this is a info');
module.exports = clearConsole;