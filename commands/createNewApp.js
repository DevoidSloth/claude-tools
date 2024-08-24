const inquirer = require('inquirer');
const chalk = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const cliProgress = require('cli-progress');

function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}


function runCommand(command, errorMessage, verbose, spinner) {
  try {
    if (verbose) {
      execSync(command, { stdio: 'inherit' });
    } else {
      execSync(command, { stdio: 'ignore' });
    }
    if (spinner) spinner.succeed();
  } catch (error) {
    if (spinner) spinner.fail();
    console.error(chalk.red(errorMessage));
    if (verbose) {
      console.error(chalk.red(error));
    }
    console.error(chalk.yellow(`Command to run manually: ${command}`));
    process.exit(1);
  }
}

async function createNewApp(verbose = false) {
  console.log(chalk.blue('Welcome to Claude Tools App Creator!'));

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

  const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progress.start(100, 0);

  // Create new React app with Vite
  let spinner = ora('Creating Vite app').start();
  runCommand(`npm create vite@latest ${appName} -- --template react`, 'Error creating Vite app', verbose, spinner);
  progress.update(20);

  process.chdir(appName);
  
  spinner = ora('Installing dependencies').start();
  runCommand('npm install', 'Error installing dependencies', verbose, spinner);
  progress.update(40);

  // Install Tailwindcss and its dependencies
  spinner = ora('Installing Tailwind CSS').start();
  runCommand('npm install -D tailwindcss postcss autoprefixer', 'Error installing Tailwind CSS', verbose, spinner);
  runCommand('npx tailwindcss init -p', 'Error initializing Tailwind CSS', verbose);
  progress.update(60);

  // Update vite.config.js
  spinner = ora('Configuring Vite').start();
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
  spinner.succeed();

  // Create jsconfig.json
  spinner = ora('Creating jsconfig.json').start();
  const jsConfig = {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    },
    "include": ["src/**/*"]
  };
  fs.writeFileSync('jsconfig.json', JSON.stringify(jsConfig, null, 2));
  spinner.succeed();

  progress.update(70);

  // Create components.json for shadcn-ui
  spinner = ora('Configuring shadcn-ui').start();
  const componentsJson = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "default",
    "rsc": false,
    "tsx": false,
    "tailwind": {
      "config": "tailwind.config.js",
      "css": "src/index.css",
      "baseColor": "slate",
      "cssVariables": true
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  };
  fs.writeFileSync('components.json', JSON.stringify(componentsJson, null, 2));
  spinner.succeed();

  // Install shadcn-ui
  spinner = ora('Initializing shadcn-ui').start();
  runCommand('npx shadcn-ui@latest init --yes', 'Error initializing shadcn-ui', verbose, spinner);
  progress.update(80);

  // Install shadcn-ui components
  spinner = ora('Installing shadcn-ui components').start();
  const shadcnComponents = [
    'alert',
    'button',
    'card',
    'checkbox',
    'dialog',
    'input',
    'label',
    'popover',
    'select',
    'separator',
    'switch',
    'tabs',
    'textarea',
    'toast'
  ];
  
  for (const component of shadcnComponents) {
    runCommand(`npx shadcn-ui@latest add ${component} --yes`, `Error adding shadcn-ui component: ${component}`, verbose);
  }
  spinner.succeed();
  progress.update(90);

  if (installLucide) {
    spinner = ora('Installing lucide-react').start();
    runCommand('npm install lucide-react', 'Error installing lucide-react', verbose, spinner);
  }

  // Add main component
  spinner = ora('Creating main component').start();
  const isLucideInstalled = isPackageInstalled('lucide-react');
  
  const componentContent = isLucideInstalled ? `
import React from 'react';
import { GithubIcon } from 'lucide-react';

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 text-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sample Website Built with claude-tools
        </h1>
        <p className="text-xl text-gray-600">
          Get started by editing your React components
        </p>
      </header>
      
      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Developed by devoidsloth on GitHub
        </p>
      </div>
      
      <footer className="text-gray-600">
        <a href="https://github.com/DevoidSloth/claude-tools" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <GithubIcon className="mr-2" size={20} />
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default ${componentName};
` : `
import React from 'react';

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 text-center">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Sample Website Built with claude-tools
        </h1>
        <p className="text-xl text-gray-600">
          Get started by editing your React components
        </p>
      </header>
      
      <div className="mb-8">
        <p className="text-lg text-gray-700">
          Developed by devoidsloth on GitHub
        </p>
      </div>
      
      <footer className="text-gray-600">
        <a href="https://github.com/DevoidSloth/claude-tools" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default ${componentName};
`;

  fs.mkdirSync(path.join('src', 'components'), { recursive: true });
  fs.writeFileSync(path.join('src', 'components', `${componentName}.jsx`), componentContent);
  spinner.succeed();

  // Update App.jsx
  spinner = ora('Updating App.jsx').start();
  const appJsxContent = `
  import './index.css'
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
  spinner.succeed();

  // Create empty App.css
  spinner = ora('Creating empty App.css').start();
  fs.writeFileSync(path.join('src', 'App.css'), '');
  spinner.succeed();

  // Update index.css
  spinner = ora('Updating index.css').start();
  const indexCssContent = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 222.2 47.4% 11.2%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 222.2 84% 4.9%;
      --radius: 0.5rem;
      --chart-1: 12 76% 61%;
      --chart-2: 173 58% 39%;
      --chart-3: 197 37% 24%;
      --chart-4: 43 74% 66%;
      --chart-5: 27 87% 67%;
    }
    .dark {
      --background: 222.2 84% 4.9%;
      --foreground: 210 40% 98%;
      --card: 222.2 84% 4.9%;
      --card-foreground: 210 40% 98%;
      --popover: 222.2 84% 4.9%;
      --popover-foreground: 210 40% 98%;
      --primary: 210 40% 98%;
      --primary-foreground: 222.2 47.4% 11.2%;
      --secondary: 217.2 32.6% 17.5%;
      --secondary-foreground: 210 40% 98%;
      --muted: 217.2 32.6% 17.5%;
      --muted-foreground: 215 20.2% 65.1%;
      --accent: 217.2 32.6% 17.5%;
      --accent-foreground: 210 40% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 210 40% 98%;
      --border: 217.2 32.6% 17.5%;
      --input: 217.2 32.6% 17.5%;
      --ring: 212.7 26.8% 83.9%;
      --chart-1: 220 70% 50%;
      --chart-2: 160 60% 45%;
      --chart-3: 30 80% 55%;
      --chart-4: 280 65% 60%;
      --chart-5: 340 75% 55%;
    }
  }

  @layer base {
    * {
      @apply border-border;
    }
    body {
      @apply bg-background text-foreground;
    }
  }
  `;

  fs.writeFileSync(path.join('src', 'index.css'), indexCssContent);
  spinner.succeed();

  spinner = ora('Installing additional dependencies').start();
  runCommand('npm install class-variance-authority @radix-ui/react-slot clsx tailwind-merge', 'Error installing additional dependencies', verbose, spinner);
  progress.update(85);

  // Create lib/utils.js
  spinner = ora('Creating utility functions').start();
  const utilsContent = `
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`;
  fs.mkdirSync(path.join('src', 'lib'), { recursive: true });
  fs.writeFileSync(path.join('src', 'lib', 'utils.js'), utilsContent);
  spinner.succeed();

  // Update Tailwind CSS configuration
  spinner = ora('Updating Tailwind CSS configuration').start();
  const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`;
  fs.writeFileSync('tailwind.config.js', tailwindConfig);
  spinner.succeed();

  // Install tailwindcss-animate
  spinner = ora('Installing tailwindcss-animate').start();
  runCommand('npm install tailwindcss-animate', 'Error installing tailwindcss-animate', verbose, spinner);
  progress.update(95);


  progress.update(100);
  progress.stop();

  console.log(chalk.green('\nNew Claude app created successfully!'));
  console.log(chalk.yellow('\nNext steps:'));
  console.log(chalk.cyan(`1. cd ${appName}`));
  console.log(chalk.cyan('2. npm run dev'));
  console.log(chalk.yellow('\nHappy coding!'));
}

module.exports = { createNewApp };