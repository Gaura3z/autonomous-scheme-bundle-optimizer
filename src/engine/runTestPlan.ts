/**
 * CLI Runner for Systematic Engine Test Plan
 * Execute with: npx tsx src/engine/runTestPlan.ts
 */
import { runSystematicTestPlan } from './systematicTestPlan';

console.log('===========================================================');
console.log('  SchemeWise Autonomous Engine — Systematic Test Plan');
console.log('===========================================================\n');

const startTime = performance.now();
const summary = runSystematicTestPlan();
const totalTime = Math.round((performance.now() - startTime) * 100) / 100;

summary.results.forEach((test, idx) => {
  const badge = test.passed ? '✅ [PASS]' : '❌ [FAIL]';
  console.log(`${badge} ${test.id}: ${test.name} (${test.durationMs}ms)`);
  console.log(`   Category: ${test.category} | ${test.description}`);
  test.assertions.forEach(a => {
    const icon = a.passed ? '  ✓' : '  ✗';
    console.log(`   ${icon} ${a.description} -> Expected: ${a.expected} | Actual: ${a.actual}`);
  });
  console.log('');
});

console.log('-----------------------------------------------------------');
console.log(`Test Execution Summary:`);
console.log(`Tests:      ${summary.passedTests}/${summary.totalTests} passed (${Math.round((summary.passedTests/summary.totalTests)*100)}%)`);
console.log(`Assertions: ${summary.passedAssertions}/${summary.totalAssertions} passed`);
console.log(`Total Time: ${totalTime}ms`);
console.log('===========================================================');

if (summary.failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
