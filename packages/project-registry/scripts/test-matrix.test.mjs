import assert from 'node:assert/strict';
import { test } from 'node:test';
import { combineCoverage, normalizeReport, cleanOutput, formatRunOutput } from './test-matrix.mjs';

const metric = (covered, total) => ({ covered, total });
const coverage = (covered, total) =>
  Object.fromEntries(
    ['statements', 'branches', 'functions', 'lines'].map((key) => [key, metric(covered, total)])
  );

test('weights coverage across client and server by instrumented totals', () => {
  assert.deepEqual(combineCoverage([coverage(1, 2), coverage(8, 8)]), {
    statements: 90,
    branches: 90,
    functions: 90,
    lines: 90,
  });
});

test('rejects absent or invalid coverage instead of fabricating percentages', () => {
  assert.throws(() => combineCoverage([{}]), /coverage/i);
  assert.throws(() => combineCoverage([coverage(3, 2)]), /coverage/i);
});

test('preserves failed and skipped tests and repository-relative suite paths', () => {
  const report = normalizeReport(
    {
      numTotalTests: 3,
      numPassedTests: 1,
      numFailedTests: 1,
      numPendingTests: 1,
      testResults: [
        {
          name: '/repo/apps/example/tests/api/route.test.ts',
          assertionResults: [
            { status: 'passed', ancestorTitles: ['Meetings API'] },
            { status: 'failed' },
            { status: 'pending' },
          ],
        },
      ],
    },
    '/repo'
  );
  assert.deepEqual(
    [report.testCount, report.passedCount, report.failedCount, report.skippedCount],
    [3, 1, 1, 1]
  );
  assert.deepEqual(report.suites, [
    { name: 'Meetings API', file: 'apps/example/tests/api/route.test.ts', type: 'integration' },
  ]);
});

test('rejects reports with no executed tests or paths outside the repository', () => {
  assert.throws(() => normalizeReport({ testResults: [] }, '/repo'), /tests/i);
  assert.throws(
    () =>
      normalizeReport(
        {
          numTotalTests: 1,
          numPassedTests: 1,
          numFailedTests: 0,
          numPendingTests: 0,
          testResults: [{ name: '/elsewhere/test.ts', assertionResults: [{ status: 'passed' }] }],
        },
        '/repo'
      ),
    /outside/i
  );
});

test('keeps runner summaries while removing machine paths and ANSI formatting', () => {
  assert.equal(
    cleanOutput('\u001b[32mPASS\u001b[0m /repo/apps/a/test.ts\nTests: 2 passed\n', '/repo'),
    'PASS apps/a/test.ts\nTests: 2 passed\n'
  );
});

test('retains failed coverage diagnostics even when the separate Turbo run passes', () => {
  const output = formatRunOutput(
    [{ path: 'apps/example', output: 'Error: coverage threshold unmet in /repo/src/a.ts' }],
    'Tasks: 1 successful, 1 total',
    0,
    '/repo'
  );
  assert.match(output, /coverage threshold unmet in src\/a.ts/);
  assert.match(output, /Tasks: 1 successful/);
});

test('retains Turbo failure details instead of only its summary', () => {
  const output = formatRunOutput([], 'Error: worker exited\nExpected: 2\nReceived: 1', 1, '/repo');
  assert.match(output, /Error: worker exited/);
  assert.match(output, /Expected: 2/);
});
