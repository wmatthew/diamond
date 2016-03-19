// Run tests for GridMap code.
// Usage: node GridTests.js
//   typically runs in less than 1 second.

var GridMap = require('./GridMap.js').GridMap;

console.log("Starting Diamond Tests");
console.time("tests");

var testsPassed = 0;
var testsRun = 0;

function assert(actual, expected, message) {
  var different = false;
	if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) different = true;
		expected.forEach(function (value, i) {
      if (value !== actual[i]) different = true;
		});
	}
  else if (actual !== expected) {
  	different = true;
  }
  if (different) {
  	console.log("  Failed: " + message);
  	console.log("    Expected: " + expected + " but got " + actual);
  } else {
  	testsPassed += 1;
  }
  testsRun += 1;
}

function allTests() {
  // Confirm assert logic works
  // assert([1,2], [2,3], "arrs"); // this really should fail
  // assert([], [2,3], "arrs"); // this really should fail
  // assert([1,2], [], "arrs"); // this really should fail
  // assert([1,2,3], [1,2,3], "arrs");

  // Test grids of different sizes
  //====================================
  // Size 1
  var testMap = new GridMap(1);
  assert(testMap.pretty(), ".", "1x1.pretty");
  assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "1x1.get_key");
  assert(testMap.complete, false, "1x1 complete");

  testMap.fillWith(2);
  assert(testMap.pretty(), "2", "1x1 filled with 2s pretty")
  assert(testMap.get_key(), 2, "1x1 filled with 2s get_key")
  assert(testMap.complete, true, "1x1 filled with 2s complete")

  //====================================
  // Size 2
  var testMap = new GridMap(2);
  assert(testMap.pretty(), ". .\n. .", "2x2.pretty");
  assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "2x2.get_key");
  assert(testMap.complete, false, "2x2 complete");

  testMap.set(0,0,2);
  assert(testMap.pretty(), "2 .\n. .", "2x2 with 1 set - pretty")
  assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "2x2 w 1 set - get_key")
  assert(testMap.complete, false, "2x2 w 1 set - complete")

  testMap.fillWith(1);
  assert(testMap.pretty(), "2 1\n1 1", "2x2 filled - pretty")
  assert(testMap.get_key(), 2111, "2x2 filled - get_key")
  assert(testMap.complete, true, "2x2 filled - complete")

  //====================================
	// Size 3
	var testMap = new GridMap(3);
	assert(testMap.pretty(), ". . .\n. . .\n. . .", "3x3.pretty");
	assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "3x3.get_key");
	assert(testMap.complete, false, "3x3.complete");

	testMap.set(0,0,3);
	assert(testMap.pretty(), "3 . .\n. . .\n. . .", "3x3.pretty");
	assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "3x3.get_key");
	assert(testMap.complete, false, "3x3.complete");

	testMap.fillWith(2);
	assert(testMap.pretty(), "3 2 2\n2 2 2\n2 2 2", "3x3.pretty");
	assert(testMap.get_key(), 322222222, "3x3.get_key");
	assert(testMap.complete, true, "3x3.complete");

	//====================================
	// Size 4 ("normal")
	var testMap = new GridMap(4);
	assert(testMap.map_size, 4, "GridMap.map_size");
	assert(testMap.pretty(), ". . . .\n. . . .\n. . . .\n. . . .", "GridMap.pretty");
	assert(testMap.get_key(), GridMap.prototype.KEY_UNKNOWN, "GridMap.get_key");

	var kids = testMap.get_children();
	assert(kids.length, 5, "testMap.get_children");
	assert(kids.map(function(x) {return x.get(0,0);}), [0,1,2,3,4], "get_children");

  var twoMap = new GridMap(4);
  twoMap.fillWith(2);
  twoMap.unset(3,3);
  assert(twoMap.complete, false, "twoMap complete after unset");
  var kids = twoMap.get_children();
  assert(kids.length, 3, "twoMap.get_children");
  assert(kids.map(function(x) {return x.get_key();}), [2222222222222220,2222222222222221,2222222222222222], "twoMap get_children > get_key");
  assert(kids.map(function(x) {return x.complete;}), [true, true, true], "twoMap get_children > complete");
  assert(twoMap.complete, false, "twoMap complete after get_children");

  var zeroMap = new GridMap(4);
  zeroMap.fillWith(0);
	assert(zeroMap.pretty(), "0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0", "zero map pretty");
	assert(zeroMap.get_key(), 0, "zero map get_key");

	// Test deep_copy
	var deep = zeroMap.deep_copy();
	deep.arr[2][2] = 3;
	assert(deep.arr[2][2], 3, "zero map deep copy - copy changed");
	assert(zeroMap.arr[2][2], 0, "zero map deep copy - original unchanged");

	// Test flipping / rotating
	var flipMap = new GridMap(4);
	flipMap.fillWith(0);
	flipMap.arr[0][0] = 4;
	flipMap.arr[0][1] = 2;
	assert(flipMap.pretty(), "4 2 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0", "flip map pretty");
	assert(flipMap.get_key(), 4200000000000000, "flip map get_key");

	// Canonical value should stay the same, even after rotation/flipping.
	var expected_canonical = 1100110010001000;
	assert(flipMap.canonical_key(), expected_canonical, "flipMap canonical_key");

	var rot1 = flipMap.tri_rotate();
	assert(rot1.get_key(), 2000200010001000, "rot1 get_key");
	assert(rot1.canonical_key(), expected_canonical, "rot1 canonical_key");

	var rot2 = rot1.tri_rotate();
	assert(rot2.get_key(), 1111110000000000, "rot2 get_key");
	assert(rot2.canonical_key(), expected_canonical, "rot2 canonical_key");

	var rot3 = rot2.tri_rotate();
	assert(rot3.get_key(), 4200000000000000, "rot3 get_key - back to original");
	assert(rot3.canonical_key(), expected_canonical, "rot3 canonical_key");

	var mirror = flipMap.mirror_flip();
	assert(mirror.get_key(), 4000200000000000, "flip map get_key");
	assert(mirror.canonical_key(), expected_canonical, "mirror canonical_key");
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