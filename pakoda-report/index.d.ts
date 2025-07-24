import { Reporter } from '@playwright/test/reporter';

interface PakodaReporterOptions {
  outputDir?: string;
}

declare class PakodaReporter implements Reporter {
  constructor(options?: PakodaReporterOptions);
  onBegin(config: any, suite: any): void;
  onTestEnd(test: any, result: any): void;
  onEnd(result: any): Promise<void>;
}

export default PakodaReporter;