const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

async function createNewApp() {
  console.log(chalk.blue('Welcome to Claude Tools App Creator!'));
  console.log(chalk.yellow('Let\'s set up your new Claude-ready React app.'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of your project?',
      default: 'my-claude-app'
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'What should we name the main component?',
      default: 'MyComponent'
    },
    {
      type: 'confirm',
      name: 'installLucide',
      message: 'Would you like to install and use lucide-react icons?',
      default: false
    }
  ]);

  const { appName, componentName, installLucide } = answers;

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
  
  if (installLucide) {
    execSync('npm install lucide-react', { stdio: 'inherit' });
  }

  // Step 4: Add main component
  const componentContent = `
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
${installLucide ? "import { Send } from 'lucide-react';" : ""}

const ${componentName} = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the input to an API and get a response
    setOutputText(\`Response to: "\${inputText}"\`);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
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
        <Button onClick={handleSubmit}>
          ${installLucide ? "<Send className='mr-2 h-4 w-4' />" : ""}
          Submit
        </Button>
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to ${appName}</h1>
      <${componentName}/>
    </div>
  )
}

export default App
`;

  fs.writeFileSync(path.join('src', 'App.jsx'), appJsxContent);

  // Update index.css with Tailwind directives
  const indexCssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
  fs.writeFileSync(path.join('src', 'index.css'), indexCssContent);

  console.log(chalk.green('\nNew Claude app created successfully!'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log(chalk.cyan(`1. cd ${appName}`));
  console.log(chalk.cyan('2. npm run dev'));
  console.log(chalk.yellow('\nHappy coding!'));
}

module.exports = { createNewApp };