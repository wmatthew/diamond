// Run tests for GridMap code.
// Usage: node GridTests.js
//   typically runs in less than 1 second.

var GridMap = require('./GridMap.js').GridMap;

console.log("Starting Diamond Tests");
console.time("tests");

var testsPassed = 0;
var testsRun = 0;

function assert(actual, expected, message) {
  if (actual != expected) {
  	console.log("  Failed: " + message);
  	console.log("    Expected: " + expected + " but got " + actual);
  } else {
  	testsPassed += 1;
  }
  testsRun += 1;
}

function allTests() {
  // Test grids of different sizes
  // Size 1
  var testMap = new GridMap(1);
  assert(testMap.pretty(), ".", "1x1.pretty");
  assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "1x1.get_key");
  assert(testMap.complete, false, "1x1 complete");

  testMap.fillWith(2);
  assert(testMap.pretty(), "2", "1x1 filled with 2s pretty")
  assert(testMap.get_key(), 2, "1x1 filled with 2s get_key")
  assert(testMap.complete, true, "1x1 filled with 2s complete")
}

// Run the tests
allTests();

// Report how it went
if (testsPassed == testsRun) {
	console.log("All " + testsRun + " tests passed.");
} else {
	console.log("Only " + testsPassed + " out of " + testsRun + " tests passed.");
}

console.timeEnd("tests");