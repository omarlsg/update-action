#!/usr/bin/env node
require('dotenv').config({path: ".env.prd"})
const commander = require('commander')
const updateSnapshot = require('./commands/updateSnapshot')
const updateLabels = require('./commands/updateLabels')
const withErrorHandler = require('./shared/withErrorHandler')

commander
  .command('labels')
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-td, --to_do <action>', 'action to execute (check/update)')
  .action(withErrorHandler(updateLabels))

commander
  .command('snapshot')
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-td, --to_do <action>', 'action to execute (check/update)')
  .action(withErrorHandler(updateSnapshot))

commander.parseAsync(process.argv)
