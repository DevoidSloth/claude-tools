#!/usr/bin/env node

const inquirer = require('inquirer');
const { createNewApp } = require('./commands/createNewApp');

console.log('Welcome to Claude Tools!');

inquirer
  .prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: ["Create a new Claude app", "Exit"]
    }
  ])
  .then(async (answers) => {
    if (answers.action === "Create a new Claude app") {
      await createNewApp();
    } else {
      console.log('Goodbye!');
    }
  });