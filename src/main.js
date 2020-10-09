#!/usr/bin/env node
require('dotenv').config({path: ".env.tst"})
const commander = require('commander')
const updateAction = require('./commands/update')
const withErrorHandler = require('./shared/withErrorHandler')

commander
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-td, --to_do <action>', 'action to execute')
  .action(withErrorHandler(updateAction))

commander.parseAsync(process.argv)
