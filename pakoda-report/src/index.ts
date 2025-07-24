import { Reporter, TestCase, TestResult, FullResult, Suite } from '@playwright/test/reporter';
import * as fs from 'fs-extra';
import * as path from 'path';

interface TestData {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted';
  duration: number;
  error?: string;
  annotations: any[];
  location: string;
  projectName: string;
}

interface SuiteData {
  title: string;
  tests: TestData[];
  suites: SuiteData[];
}

class PakodaReporter implements Reporter {
  private tests: TestData[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = options.outputDir || 'pakoda-report';
  }

  onBegin(config: any, suite: Suite) {
    this.startTime = Date.now();
    console.log('🥟 Pakoda Reporter: Starting test execution...');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testData: TestData = {
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

  async onEnd(result: FullResult) {
    this.endTime = Date.now();
    await this.generateReport();
    console.log(`🥟 Pakoda Reporter: Report generated at ${path.resolve(this.outputDir)}/index.html`);
  }

  private async generateReport() {
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

  private generateSummary() {
    const total = this.tests.length;
    const passed = this.tests.filter(t => t.status === 'passed').length;
    const failed = this.tests.filter(t => t.status === 'failed').length;
    const skipped = this.tests.filter(t => t.status === 'skipped').length;
    const timedOut = this.tests.filter(t => t.status === 'timedOut').length;
    const interrupted = this.tests.filter(t => t.status === 'interrupted').length;

    return {
      total,
      passed,
      failed,
      skipped,
      timedOut,
      interrupted,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
  }

  private async copyAssets() {
    const assetsSource = path.join(__dirname, '../assets');
    const assetsDest = path.join(this.outputDir, 'assets');
    
    if (await fs.pathExists(assetsSource)) {
      await fs.copy(assetsSource, assetsDest);
    }
  }

  private async generateHTML(data: any): Promise<string> {
    const templatePath = path.join(__dirname, '../templates/report.html');
    let template = '';
    
    if (await fs.pathExists(templatePath)) {
      template = await fs.readFile(templatePath, 'utf-8');
    } else {
      template = this.getDefaultTemplate();
    }

    return template
      .replace('{{REPORT_DATA}}', JSON.stringify(data))
      .replace('{{TITLE}}', 'Pakoda Test Report')
      .replace('{{TIMESTAMP}}', new Date().toLocaleString());
  }

  private getDefaultTemplate(): string {
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
}

export default PakodaReporter;