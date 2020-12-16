#!/usr/bin/env node
require('dotenv').config({path: ".env.prd"})
const commander = require('commander')
const updateTarget = require('./commands/updateTarget')
const updateLabels = require('./commands/updateLabels')
const withErrorHandler = require('./shared/withErrorHandler')

commander
  .command('labels')
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-td, --to_do <action>', 'action to execute (check/update)')
  .action(withErrorHandler(updateLabels))

commander
  .command('target')
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-td, --to_do <action>', 'action to execute (check/update)')
  .action(withErrorHandler(updateTarget))

commander.parseAsync(process.argv)
