# Claude Tools

Claude Tools is a CLI utility for quickly setting up and managing Claude-related React applications. It streamlines the process of creating new apps with pre-configured settings and components tailored for Claude AI interactions.

## Inspiration

This project is inspired by and based on the excellent work done in [Bklieger/Claude-React-Jumpstart](https://github.com/Bklieger/Claude-React-Jumpstart). We've expanded on the original concept to create a more flexible and extensible CLI tool.

## Features

- Quick setup of a new React app with Vite
- Automatic installation and configuration of Tailwind CSS and Shadcn UI
- Creation of a customizable main component for Claude AI interaction
- Optional installation of lucide-react for icons
- Interactive CLI interface for easy project setup

## Usage

To create a new Claude-ready React app, run:

```bash
npx claude-tools new-app
```

If you haven't used `claude-tools` before, `npx` will prompt you to install it temporarily. After confirming, it will run the command.

Follow the interactive prompts to customize your new app:

1. Enter the name of your project
2. Specify the name of the main component
3. Choose whether to install lucide-react for icons

The tool will then create a new directory with your app name, set up the React project with Vite, install necessary dependencies, and create the main component.

## Quickstart

After creating your app, follow these steps to get started:

1. Navigate to your new app directory:
   ```bash
   cd your-app-name
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit `http://localhost:5173` to see your new app in action!

## Development

To contribute to Claude Tools:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/claude-tools.git
   cd claude-tools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make your changes and test them locally:
   ```bash
   node index.js new-app
   ```

4. Submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Bklieger/Claude-React-Jumpstart](https://github.com/Bklieger/Claude-React-Jumpstart) for the original inspiration and guide.
- The Anthropic team for creating Claude AI.
- The creators and maintainers of React, Vite, Tailwind CSS, Shadcn UI, and Lucide React.