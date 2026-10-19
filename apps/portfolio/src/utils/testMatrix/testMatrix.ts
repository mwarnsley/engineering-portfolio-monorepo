import type { ProjectTestSuite } from '@engineering-portfolio/project-registry';

export const summarizeTestSuites = (suites: readonly ProjectTestSuite[]) => ({
  total: suites.reduce((count, suite) => count + suite.testCount, 0),
  passed: suites.reduce((count, suite) => count + suite.passedCount, 0),
  failed: suites.reduce((count, suite) => count + suite.failedCount, 0),
  skipped: suites.reduce((count, suite) => count + suite.skippedCount, 0),
  files: suites.reduce((count, suite) => count + suite.suites.length, 0),
  success:
    suites.length > 0 &&
    suites.every((suite) => suite.status === 'passed' && suite.failedCount === 0),
});
