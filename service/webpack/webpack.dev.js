const path = require('path');
const chalk = require('../../src/chalk');
const config = require(path.resolve(`${process.cwd()}/zys.config.js`));
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const clearConsole = require('../../src/clear');

const port = config.port || 8080;
const open = config.open || false;
const proxy = config.proxy || {};

const devPlugin = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ProgressPlugin(function(percentage) {
    if (percentage === 1) {
      clearConsole('cyan', `zys v${require('../../package.json').version}`);
      console.log(chalk.cyan(`- Local: http://localhost:${port}/`));
      console.log(chalk.cyan(`- Network: http://${getIPAdress()}:${port}/`));
      // console.log(chalk.cyan(`- Documentation: https://codexu.github.io/`));
      console.log('');
    }
  }),
]
const configPlugin = config.plugins || []
const plugins = [...devPlugin, ...configPlugin]
let extensions = []
if (config.resolve) {
  extensions = [...(config.resolve.extensions || [])]
}
common.resolve.extensions = [...new Set([...extensions, ...common.resolve.extensions])]
module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port,
    hot: true,
    open,
    proxy,
    host: '0.0.0.0',
    overlay: {
      warnings: true,
      errors: true
    },
    stats:'minimal'
  },
  module: {
    rules: [...config.rules]
  },
  plugins: plugins
});

function getIPAdress() {
  let interfaces = require('os').networkInterfaces();
  // eslint-disable-next-line guard-for-in
  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}