#!/usr/bin/env node

const { resolve, dirname, extname } = require('path')
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const yargs = require('yargs')

const logo = require('..')

const read = promisify(readFile)
const write = promisify(writeFile)

function command (yargs) {
  // NOTE: a bug in yargs is causing positional arguments to be processed in reverse

  yargs
    .positional('config', {
      describe: 'path to logo config file'
      // default: 'logo.json' // disabled due to yargs bug
    })
    .positional('output', {
      describe: 'path to logo output'
      // default: 'logo.svg' // disabled due to yargs bug
    })
}

function builder (argv) {
  const path = resolve(argv.output) // should be argv.config
  const cwd = dirname(path)
  const format = extname(argv.config).replace('.', '') // should be argv.output

  // attempt to load config json
  read(path)
    .then(JSON.parse)
    .then(config => logo(config, cwd, format))
    .then(output => write(argv.config, output)) // should be argv.output
    .catch(error => {
      console.error(error.message, '\n')

      yargs.showHelp()
    })
}

yargs.command('$0 [config] <output>', 'Logo Builder', command, builder).argv // eslint-disable-line no-unused-expressions
