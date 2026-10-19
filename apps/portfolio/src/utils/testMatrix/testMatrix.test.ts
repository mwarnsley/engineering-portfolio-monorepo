import { describe, expect, it } from 'vitest';
import type { ProjectTestSuite } from '@engineering-portfolio/project-registry';
import { summarizeTestSuites } from './testMatrix';

const suite: ProjectTestSuite = {
  framework: 'Vitest',
  testCount: 4,
  passedCount: 2,
  failedCount: 1,
  skippedCount: 1,
  status: 'failed',
  coverage: { statements: 50, branches: 50, functions: 50, lines: 50 },
  coverageScope: ['src'],
  suites: [{ name: 'sample', file: 'tests/sample.test.ts', type: 'unit' }],
  recentRunDate: '2026-10-19T00:00:00.000Z',
};

describe('summarizeTestSuites', () => {
  it('counts failures and skipped tests separately from passing tests', () => {
    expect(summarizeTestSuites([suite, suite])).toEqual({
      total: 8,
      passed: 4,
      failed: 2,
      skipped: 2,
      files: 2,
      success: false,
    });
  });
  it('does not report an empty snapshot as passing', () => {
    expect(summarizeTestSuites([]).success).toBe(false);
  });
  it('does not hide a runner failure when individual tests passed', () => {
    expect(
      summarizeTestSuites([{ ...suite, testCount: 2, failedCount: 0, skippedCount: 0 }]).success
    ).toBe(false);
  });
});
