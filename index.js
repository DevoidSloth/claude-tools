#!/usr/bin/env node

const { program } = require('commander');
const { createNewApp } = require('./commands/createNewApp');
const packageJson = require('./package.json');

program
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .description('CLI tools for creating and managing Claude artifacts');

program
  .command('new-app')
  .description('Create a new Claude app')
  .option('--verbose', 'Show detailed output')
  .action((options) => {
    createNewApp(options.verbose);
  });

program.parse(process.argv);

// If no arguments are provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}