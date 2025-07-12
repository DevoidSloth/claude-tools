# Claude Tools (DEPRECATED)

Claude Tools is a powerful CLI utility for quickly setting up and managing Claude-generated React applications. It streamlines the process of creating new apps with pre-configured settings and components tailored for Claude's Artifacts.

**The tool is currently deprecated due to a change in some commands it used to rely on, feel free to submit a PR if you would like to fix it**

## Features

- Quick setup of a new React app with Vite
- Automatic installation and configuration of Tailwind CSS and Shadcn UI
- Creation of a customizable main component
- Optional installation of lucide-react icons
- Interactive CLI interface with progress indicators
- Verbose mode for detailed output

## Installation

To install Claude Tools globally, run:

```bash
npm install -g claude-tools
```

This will make the `claude-tools` command available system-wide.

## Usage

To create a new Claude-ready React app, run:

```bash
claude-tools new-app
```

Follow the interactive prompts to customize your new app:

1. Enter the name of your project
2. Specify the name of the main component
3. Choose whether to install lucide-react icons

The tool will then create a new directory with your app name, set up the React project with Vite, install necessary dependencies, and create the main component.

### Options

- `--verbose`: Show detailed output during the app creation process
- `-v, --version`: Output the current version of Claude Tools

Example with verbose output:

```bash
claude-tools new-app --verbose
```

## What's Included

Your new Claude app will come with:

- A React project set up with Vite
- Tailwind CSS configured and ready to use
- Shadcn UI components (Card, Button, Input) pre-installed
- A main component 
- Proper configuration for using `@` imports

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

## Support

KNOWN ISSUE: If you are on mac and in a file without write permissions you may need to use the command 
`sudo -s`
before running it.

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/devoidsloth/claude-tools/issues).

Happy coding with Claude Tools!
