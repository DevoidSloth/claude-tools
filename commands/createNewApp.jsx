const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

async function createNewApp() {
  const { appName, componentName, className } = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of your app?',
      validate: input => input.length > 0 || 'Please enter an app name'
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'What should we name the main component?',
      default: 'LLMModel'
    },
    {
      type: 'input',
      name: 'className',
      message: 'What CSS class name should we use for the component?',
      default: 'w-[350px]'
    }
  ]);

  console.log(chalk.blue(`Creating a new Claude app: ${appName}`));

  // Step 1: Create new React app with Vite
  execSync(`npm create vite@latest ${appName} -- --template react`, { stdio: 'inherit' });
  process.chdir(appName);
  execSync('npm install', { stdio: 'inherit' });

  // Step 2: Install Tailwindcss and Shadcn
  execSync('npm install -D tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  execSync('npx tailwindcss init -p', { stdio: 'inherit' });

  // Update vite.config.js
  const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`;

  fs.writeFileSync('vite.config.js', viteConfig);

  // Create jsconfig.json
  const jsConfig = `
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"]
}
`;

  fs.writeFileSync('jsconfig.json', jsConfig);

  // Initialize shadcn-ui
  execSync('npx shadcn-ui@latest init', { stdio: 'inherit' });

  // Step 3: Install other libraries and components
  execSync('npx shadcn-ui@latest add card button input', { stdio: 'inherit' });
  execSync('npm install lucide-react', { stdio: 'inherit' });

  // Step 4: Add main component
  const componentContent = `
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ${componentName} = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the input to an API and get a response
    setOutputText(\`Response to: "\${inputText}"\`);
  };

  return (
    <Card className="${className}">
      <CardHeader>
        <CardTitle>LLM Model Interface</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your prompt"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSubmit}>Submit</Button>
      </CardFooter>
      {outputText && (
        <CardContent>
          <p>{outputText}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default ${componentName};
`;

  fs.mkdirSync(path.join('src', 'components'), { recursive: true });
  fs.writeFileSync(path.join('src', 'components', `${componentName}.jsx`), componentContent);

  // Update App.jsx
  const appJsxContent = `
import './App.css'
import ${componentName} from './components/${componentName}'

function App() {
  return (
    <>
      <${componentName}/>
    </>
  )
}

export default App
`;

  fs.writeFileSync(path.join('src', 'App.jsx'), appJsxContent);

  console.log(chalk.green('New Claude app created successfully!'));
  console.log(chalk.yellow('To start the app, run:'));
  console.log(chalk.cyan(`cd ${appName} && npm run dev`));
}

module.exports = { createNewApp };