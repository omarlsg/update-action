#!/usr/bin/env node
require('dotenv').config({path: ".env.prd"})
const commander = require('commander')
const withErrorHandler = require('./shared/withErrorHandler')
const updateLabels = require('./commands/updateLabels')
const updateSnapshot = require('./commands/updateSnapshot')
const getSnapshotInfo = require('./commands/getSnapshotInfo')


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

commander
  .command('info')
  .requiredOption('-f, --file <file>', 'file name')
  .requiredOption('-o, --output <path>', 'output path for the results')
  .action(withErrorHandler(getSnapshotInfo))

commander.parseAsync(process.argv)
