#!/usr/bin/env node
'use strict';

var pkg = require('package')
var path = require('path')

function dedent(input){
  var output = input.replace(/^\n/, '')
  var indent = output.match(/^([ \t]*)/)[1]
  return output.replace(new RegExp(`^${indent}`, 'gm'), '')
}

function getConfigFile(dir) {
  var localYConfigFile = path.resolve(dir, 'vegetables.yml')
  var localJConfigFile = path.resolve(dir, 'vegetables.json')

  if (!myConfig) {
    if (fs.existsSync(localYConfigFile)) {
      return localYConfigFile
    } else if (fs.existsSync(localJConfigFile)) {
      return localJConfigFile
    }
  }
  throw new Error("no configfile found in "+dir)
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
  	'theme': 'Path to the template or name of template package',
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

if (!myConfig) {
  try {
    myConfig = getConfigFile('.')
  } catch (e) {
  }
}

// this config
argv.config = path.resolve(__dirname, '..', 'vegetables.yml')

// read default config
var config = veggy.readConfig(argv)

argv.config = config

if (argv.theme) {
  var themePath;
  try {
    themePath = path.resolve(require.resolve(argv.theme), '..')
  }
  catch (e) {
    themePath = path.resolve(argv.theme)
  }
  try {
    var configFile = getConfigFile(themePath)
    config.update(configFile)
  }
  catch (e) {
    console.log(e)
  }
  var templatePath = path.resolve(themePath, 'template')
  if (fs.existsSync(templatePath)) {
    config.update({template: templatePath})
  }
}

// update config with user config
if (myConfig) {
  config.update(myConfig)
}

config.template.reverse()


// show the web pages (with slides)
if (argv._[0] === 'show') {
  argv.config = config
  veggy.serve(argv, config)
  require('open')(`http://${config.host}:${config.port}/`)
} else if (argv._[0] === 'show-config') {
  var yaml = require('js-yaml')
  console.log(yaml.dump(config, {flowLevel: 3}))

} else if (argv.help){
  console.log(yargs.help())
}
