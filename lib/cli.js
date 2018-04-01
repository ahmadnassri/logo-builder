#!/usr/bin/env node

const { resolve, dirname, extname } = require('path')
const { readFile, writeFile } = require('fs')
const { promisify } = require('util')
const yargs = require('yargs')

const logo = require('..')

const read = promisify(readFile)
const write = promisify(writeFile)

function command (yargs) {
  yargs
    .positional('config', {
      describe: 'path to logo config file',
      default: 'logo.json'
    })
    .positional('output', {
      describe: 'path to logo output',
      default: 'logo.svg'
    })
}

function builder (argv) {
  const path = resolve(argv.config)
  const cwd = dirname(path)
  const format = extname(argv.output).replace('.', '')

  // attempt to load config json
  read(path)
    .then(JSON.parse)
    .then(config => logo(config, cwd, format))
    .then(output => write(argv.output, output))
    .catch(error => {
      console.error(error.message, '\n')

      yargs.showHelp()
    })
}

yargs.command('$0 <config> [output]', 'Logo Builder', command, builder).argv // eslint-disable-line no-unused-expressions
