#!/usr/bin/env node
'use strict';

var pkg = require('package')
var path = require('path')

function dedent(input){
  var output = input.replace(/^\n/, '')
  var indent = output.match(/^([ \t]*)/)[1]
  return output.replace(new RegExp(`^${indent}`, 'gm'), '')
}

var yargs = require('yargs')
  .usage(`${pkg.name} [options] <command>`)
  .command('show', dedent(`
    Generate slides, serve them and start browser.
  `))
  .addHelpOpt()
  .string('_')
  .describe({
  	'globaltitle': 'Generated Web site title',
  	'template': 'Path to the template',
  	'host': 'Host for the serve command. Set to * to allow access from your local network',
  	'port': 'Access port. Default: 8888',
  	'help': 'This screen',
  	'version': 'Display the... version',
  	'verbose': 'Enable verbose mode',
  	'silent': 'Disable every outputs',
  	'config': 'Configuration file. If not set, and if present, vegetables.json is used.'
  })
  .boolean('version')
  .boolean('help')
  .boolean('silent')
  .count('verbose')
  .string('_')
  .string('config')
  .default({
  	'config': '' // should not begin with .
  });

var veggy = require('vegetables')
var argv = yargs.argv

// show help if no command given
if (!argv._.length) {
  yargs.showHelp()
  process.exit(0)
}

var myConfig = argv.config;
argv.config = path.resolve(__dirname, 'vegetables.yml')

// read default config
var config = veggy.readConfig(argv)
argv.config = config

// update config with user config
if (myConfig) {
  config.update(myConfig)
}

// show the web pages (with slides)
if (argv._[0] === 'show') {
  argv.config = config
  veggy.serve(argv, config)
  require('open')(`http://${config.host}:${config.port}/`)

} else if (argv.help){
  console.log(yargs.help())
}
