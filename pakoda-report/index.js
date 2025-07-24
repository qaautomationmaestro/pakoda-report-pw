const path = require('path');
const fs = require('fs-extra');

class PakodaReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || 'pakoda-report';
    this.tests = [];
    this.startTime = 0;
    this.endTime = 0;
  }

  onBegin(config, suite) {
    this.startTime = Date.now();
    console.log('🥟 Pakoda Reporter: Starting test execution...');
  }

  onTestEnd(test, result) {
    const testData = {
      id: `${test.parent.title}-${test.title}`.replace(/\s+/g, '-').toLowerCase(),
      title: test.title,
      status: result.status,
      duration: result.duration,
      error: result.error?.message,
      annotations: result.annotations,
      location: `${test.location.file}:${test.location.line}`,
      projectName: test.parent.project()?.name || 'default'
    };
    
    this.tests.push(testData);
  }

  async onEnd(result) {
    this.endTime = Date.now();
    await this.generateReport();
    console.log(`🥟 Pakoda Reporter: Report generated at ${path.resolve(this.outputDir)}/index.html`);
  }

  generateSummary() {
    const total = this.tests.length;
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;
    const timedOut = this.tests.filter(t => t.status === 'timedOut').length;

    return {
      total,
      passed,
      failed,
      skipped,
      timedOut,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }

  async copyAssets() {
    const assetsSource = path.join(__dirname, 'assets');
    const assetsDest = path.join(this.outputDir, 'assets');
    
    if (await fs.pathExists(assetsSource)) {
      await fs.copy(assetsSource, assetsDest);
    }
  }

  async generateHTML(data) {
    const templatePath = path.join(__dirname, 'templates/report.html');
    let template = '';
    
    if (await fs.pathExists(templatePath)) {
      template = await fs.readFile(templatePath, 'utf-8');
    } else {
      template = this.getDefaultTemplate();
    }

    return template
      .replace('{{REPORT_DATA}}', JSON.stringify(data))
      .replace('{{TITLE}}', 'Pakoda Test Report')
      .replace(/{{TIMESTAMP}}/g, new Date().toLocaleString());
  }

  getDefaultTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body>
    <div id="app"></div>
    <script>
        window.reportData = {{REPORT_DATA}};
    </script>
    <script src="assets/app.js"></script>
</body>
</html>`;
  }

  async generateReport() {
    await fs.ensureDir(this.outputDir);
    
    const reportData = {
      summary: this.generateSummary(),
      tests: this.tests,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.endTime - this.startTime
    };

    // Copy assets
    await this.copyAssets();
    
    // Generate HTML report
    const htmlContent = await this.generateHTML(reportData);
    await fs.writeFile(path.join(this.outputDir, 'index.html'), htmlContent);
    
    // Generate JSON data
    await fs.writeFile(path.join(this.outputDir, 'data.json'), JSON.stringify(reportData, null, 2));
  }
}

module.exports = PakodaReporter;