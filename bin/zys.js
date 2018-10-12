#!/usr/bin/env node
const program = require('commander');
// http://tj.github.io/commander.js/
const packageJson = require('../package');
const init = require('./init');


function parseListArgv( val ) {
  if ( val ) {
    return val.split( ',' );
  } else {
    return [];
  }
}

program
  .version( packageJson.version, '-v, --version' )
  .option( '-u, --use-version <version-number>', 'Webpack version' )
  .option( '-j, --js-processors <processors>', 'Specify javascript processors', parseListArgv )
  .option( '-s, --style-processors <processors>', 'Specify style(css,image,fonts) processors', parseListArgv )
  .option( '--no-install', 'Do not install devDependncies package' );

program
  .command('create')
  .description('create f new file')
  .action(function(){
    //   console.log('创建成功');
    init();
  })

  program
  .command('*')
  .description('*******')
  .action(function(){
    //   console.log('创建成功');
    process.exit();
  })
  

program.parse(process.argv);

