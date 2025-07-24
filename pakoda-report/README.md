# 🥟 Pakoda Report

A beautiful, modern HTML reporter for Playwright tests with interactive UI elements and stunning visualizations.

![Pakoda Report Demo](https://img.shields.io/badge/status-active-brightgreen) ![npm version](https://img.shields.io/npm/v/pakoda-report.svg) ![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🎨 **Modern Dark/Light Theme** - Beautiful UI with smooth theme switching
- 📊 **Interactive Dashboard** - Real-time statistics and progress visualization
- 🔍 **Advanced Filtering** - Filter by status, search tests, and project-based organization
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Fast Performance** - Optimized for large test suites
- 💾 **Export Functionality** - Export reports as JSON for further analysis
- 🎭 **Playwright Native** - Built specifically for Playwright with full feature support
- 🌈 **Beautiful Animations** - Smooth transitions and engaging micro-interactions

## 🚀 Installation

```bash
npm install pakoda-report --save-dev
# or
yarn add pakoda-report --dev
# or
pnpm add pakoda-report --dev
```

## 📖 Usage

### Basic Configuration

Add the reporter to your `playwright.config.js`:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // ... other config
  reporter: [
    ['list'], // Keep the default list reporter
    ['pakoda-report', { outputDir: 'pakoda-report' }]
  ],
  // ... rest of config
});
```

### Advanced Configuration

```javascript
export default defineConfig({
  reporter: [
    ['pakoda-report', {
      outputDir: 'custom-report-dir', // Custom output directory
      // Add more options as they become available
    }]
  ],
});
```

### Running Tests

```bash
# Run your tests normally
npx playwright test

# The report will be generated in the specified output directory
# Open pakoda-report/index.html in your browser to view the report
```

## 🎨 Report Features

### Dashboard Overview
- **Test Summary Cards** - Total, Passed, Failed, Skipped tests with beautiful gradients
- **Pass Rate Visualization** - Animated progress bar showing test success rate
- **Duration Tracking** - Total test execution time with smart formatting
- **Real-time Statistics** - Live updates as tests complete

### Advanced Filtering
- **Status Filters** - Quick filter by passed, failed, skipped tests
- **Search Functionality** - Search tests by title, location, or project name
- **Project Grouping** - Organize tests by Playwright project configuration

### Test Details
- **Rich Test Information** - Title, status, duration, location, and project
- **Error Details** - Expandable error messages with syntax highlighting  
- **Interactive Actions** - Copy test info, toggle error details
- **Status Indicators** - Color-coded badges with intuitive icons

### Theme & Customization
- **Dark/Light Mode** - Toggle between themes with preference saving
- **Responsive Layout** - Adapts beautifully to any screen size
- **Smooth Animations** - Engaging micro-interactions and transitions
- **Modern Typography** - Clean, readable fonts optimized for code

## 📁 Project Structure

```
pakoda-report/
├── src/
│   └── index.ts          # Main reporter implementation
├── templates/
│   └── report.html       # HTML template
├── assets/
│   ├── styles.css        # CSS styles and animations
│   └── app.js           # Interactive JavaScript functionality
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development

### Building the Package

```bash
cd pakoda-report
npm install
npm run build
```

### Testing with Demo Project

```bash
cd playwright-demo
npm install
npm test
```

The demo project includes various test scenarios:
- ✅ Passing tests
- ❌ Failing tests  
- ⏭️ Skipped tests
- ⏱️ Timeout scenarios
- 📱 Mobile tests
- 🌐 API tests
- 📸 Visual tests

## 📦 Publishing to NPM

### Manual Publishing

1. **Build the package:**
   ```bash
   cd pakoda-report
   npm run build
   ```

2. **Update version:**
   ```bash
   npm version patch  # or minor/major
   ```

3. **Publish to NPM:**
   ```bash
   npm publish
   ```

### Publishing Checklist

- [ ] Update version in `package.json`
- [ ] Build TypeScript files (`npm run build`)  
- [ ] Test with demo project
- [ ] Update README if needed
- [ ] Commit and tag version
- [ ] Publish to NPM (`npm publish`)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the Playwright community
- Inspired by modern web design principles
- Uses Tailwind CSS for styling
- Font Awesome for icons
- Inter font for typography

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/pakoda-report/issues) page
2. Create a new issue with detailed information
3. Include your Playwright configuration and error messages

---

**Made with 🥟 and lots of ☕ by the Pakoda Team**