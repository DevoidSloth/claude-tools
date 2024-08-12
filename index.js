#!/usr/bin/env node

const { program } = require('commander');
const { createNewApp } = require('./commands/createNewApp');

program
  .version('1.0.0')
  .description('CLI tools for creating and managing Claude-related apps');

program
  .command('new-app')
  .description('Create a new Claude app')
  .action(createNewApp);

program.parse(process.argv);