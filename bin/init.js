/**
 * 栗子：命令行工具 npm init
 * 
*/

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const checkVersion = require('../src/check');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    promt: 'OHAI>'
});

const preHint = `
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See \`npm help json\` for definitive documentation on these fields
and exactly what they do.

Use \`npm install <pkg> --save\` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
`;
console.log(preHint);

// 问题
let questions = ['name', 'version', 'description', 'entry point', 'test command', 'author', 'license', 'git repository', 'keywords'];

// 默认答案
let basepath = path.resolve(__dirname);
let paths = basepath.split('\\');
let defaultName = paths[paths.length - 1];
let version = '1.0.0', description = '',entry = '', command = {"test": "echo \"Error: no test specified\" && exit 1"},repository = {type: 'git', url: ''},key = [], author = '', license = 'ISC';

try{
    fs.accessSync('./' + defaultName + '.js');
    entry = defaultName + '.js';
}catch(err){
    // console.log(err);
    // 获取当前目录下所有技术文件，取第一个文件名为入口
    getEntry();
}

function getEntry(){
    let files = fs.readdirSync(basepath);
    if(Array.isArray(files) && files.length){
        let entryFile = files.find(file => {
            return path.extname(file) === '.js';
        })
        if(!entryFile){
            entry = 'index.js';
        }else{
            entry = entryFile;
        }
    }else{
        entry = 'index.js';
    }
}

let defaultAnswers = [defaultName, version, description, entry, command, author, license, repository, key];

// 用户答案
let answers = [];
let index = 0;

function createPackageJson(){
    let map = {};
    questions.forEach(function(qu, index){
        qu === 'entry point' && (qu = 'main');
        qu === 'test command' && (qu = 'scripts');
        qu === 'git repository' && (qu = 'repository');
        map[qu] = answers[index];
    });
    // process.exit();
    map.repository.url || delete map.repository;
    map.keywords.length || delete map.keywords;
    console.log('About to write to ' + basepath + '\\package.json：\n');
    console.log(map);
    console.log('\n\n');
    rl.question('Is this ok? (yes)',function(an){
        let ans = an.toString().toLocaleLowerCase();
        if(ans === 'y' || ans === 'ye' || ans === 'yes' || ans === ''){
            fs.writeFileSync('./package.json',JSON.stringify(map, null, 4));
            // rl.close();
            process.exit();
        }else{
            console.log('Aborted.\n\n');
            // rl.close();
            process.exit();
        }
    })    
}

function runQuestionLoop(){
    if(index === questions.length){
        createPackageJson();
        return ;
    }
    let defaultAnswer = defaultAnswers[index];
    let question = defaultAnswer && typeof defaultAnswer === 'string' ? questions[index] + '：(' + defaultAnswer + ')' : questions[index] + '：';

    rl.question(question, function(answer){
        if(question === 'git repository：' || question === 'keywords：'){
            if(question === 'git repository：'){
                if(answer){
                    defaultAnswer.url = answer;
                }
                answers.push(defaultAnswer);
            }
            if(question === 'keywords：'){
                if(answer){
                    defaultAnswer.push(answer);
                }
                answers.push(defaultAnswer);
            }
        }else{
            if(question === 'test command：'){
                if(answer){
                    defaultAnswer.test = answer;
                }
                answers.push(defaultAnswer);
            }else{
                answers.push(answer || defaultAnswer);
            }
        }
        index++;
        runQuestionLoop();
    })
}
// runQuestionLoop();

rl.on('close',() => {
    console.log('npm \x1b[30;43mWARN\x1b[0m \x1b[35minit\x1b[0m cancled');
})

module.exports = runQuestionLoop;