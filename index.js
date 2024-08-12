#!/usr/bin/env node

const { createNewApp } = require('./commands/createNewApp');

if (process.argv[2] === 'new-app') {
  createNewApp();
} else {
  console.log('Usage: claude-tools new-app');
}