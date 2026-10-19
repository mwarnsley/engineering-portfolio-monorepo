import { relative, isAbsolute } from 'node:path';
import { stripVTControlCharacters } from 'node:util';

const metrics = ['statements', 'branches', 'functions', 'lines'];

export function combineCoverage(summaries) {
  if (!summaries.length) throw new Error('Missing coverage summaries');
  return Object.fromEntries(
    metrics.map((key) => {
      let covered = 0;
      let total = 0;
      for (const summary of summaries) {
        const metric = summary[key];
        if (
          !metric ||
          !Number.isInteger(metric.covered) ||
          !Number.isInteger(metric.total) ||
          metric.covered < 0 ||
          metric.total < metric.covered
        ) {
          throw new Error(`Invalid coverage for ${key}`);
        }
        covered += metric.covered;
        total += metric.total;
      }
      return [key, total === 0 ? 100 : Math.floor((covered / total) * 10000) / 100];
    })
  );
}

export function normalizeReport(report, root) {
  if (!report.numTotalTests || !report.testResults?.length) throw new Error('No tests in report');
  const result = { testCount: 0, passedCount: 0, failedCount: 0, skippedCount: 0, suites: [] };
  for (const suite of report.testResults) {
    const file = relative(root, suite.name).replaceAll('\\', '/');
    if (isAbsolute(file) || file.startsWith('../')) throw new Error('Suite is outside repository');
    for (const assertion of suite.assertionResults) {
      result.testCount++;
      if (assertion.status === 'passed') result.passedCount++;
      else if (assertion.status === 'failed') result.failedCount++;
      else if (['pending', 'skipped', 'todo', 'disabled'].includes(assertion.status))
        result.skippedCount++;
      else throw new Error(`Unknown assertion status: ${assertion.status}`);
    }
    // Components with isolated dependencies are units. Page/app orchestration is integration.
    const type =
      /\/tests\/(api|app)\/|\/src\/(pages\/|App\.test)|\/client\/tests\/ChatSimulator/.test(file)
        ? 'integration'
        : 'unit';
    result.suites.push({
      name: suite.assertionResults[0]?.ancestorTitles?.[0] || file.split('/').at(-1),
      file,
      type,
    });
  }
  if (
    result.testCount !== report.numTotalTests ||
    result.passedCount !== report.numPassedTests ||
    result.failedCount !== report.numFailedTests
  )
    throw new Error('Inconsistent tests in report');
  result.suites.sort((a, b) => a.file.localeCompare(b.file));
  return result;
}

export function cleanOutput(output, root) {
  return stripVTControlCharacters(output).replaceAll(`${root}/`, '').replaceAll(root, '.');
}

export function formatRunOutput(collectionFailures, turboOutput, turboStatus, root) {
  const diagnostics = collectionFailures.map(
    ({ path, output }) => `Coverage collection failed: ${path}\n${cleanOutput(output, root).trim()}`
  );
  const turbo = cleanOutput(turboOutput, root);
  const summary =
    turboStatus !== 0
      ? turbo
      : turbo
          .split('\n')
          .filter((line) =>
            /PASS |FAIL |✓ |✖ |Test Suites:|Test Files |Tests:|Tests |Tasks:|Cached:|Time:|Remote caching/.test(
              line
            )
          )
          .join('\n');
  return [...diagnostics, summary].join('\n\n').trim();
}
