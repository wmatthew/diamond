#!/usr/bin/env ruby

# Run the diamond tests.
# Usage: ruby diamond_tests.rb
#   runs in less than 1 second.

require './diamond'

puts "Starting Diamond Tests"
$start_time = Time.now

$tests_passed = 0
$tests_run = 0

def assert(actual, expected, message)
	if (actual != expected)
		puts "  FAILED: #{message}"
		puts "    Expected #{expected} but got #{actual}"
	else
		$tests_passed = $tests_passed + 1
		# puts "  Pass"
	end
	$tests_run = $tests_run + 1
end

def all_tests
	# Test grids of different sizes
	#====================================
	# Size 1
	testMap = GridMap.new(1)
	assert(testMap.pretty, ".", "1x1.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "1x1.get_key")
	assert(testMap.complete, false, "1x1.complete")

	testMap.fillWith(2)
	assert(testMap.pretty, "2", "1x1.pretty")
	assert(testMap.get_key, 2, "1x1.get_key")
	assert(testMap.complete, true, "1x1.complete")

	#====================================
	# Size 2
	testMap = GridMap.new(2)
	assert(testMap.pretty, ". .\n. .", "2x2.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "2x2.get_key")
	assert(testMap.complete, false, "2x2.complete")

	testMap.set(0,0,2)
	assert(testMap.pretty, "2 .\n. .", "2x2.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "2x2.get_key")
	assert(testMap.complete, false, "2x2.complete")

	testMap.fillWith(1)
	assert(testMap.pretty, "2 1\n1 1", "2x2.pretty")
	assert(testMap.get_key, 2111, "2x2.get_key")
	assert(testMap.complete, true, "2x2.complete")

	#====================================
	# Size 3
	testMap = GridMap.new(3)
	assert(testMap.pretty, ". . .\n. . .\n. . .", "3x3.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "3x3.get_key")
	assert(testMap.complete, false, "3x3.complete")

	testMap.set(0,0,3)
	assert(testMap.pretty, "3 . .\n. . .\n. . .", "3x3.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "3x3.get_key")
	assert(testMap.complete, false, "3x3.complete")

	testMap.fillWith(2)
	assert(testMap.pretty, "3 2 2\n2 2 2\n2 2 2", "3x3.pretty")
	assert(testMap.get_key, 322222222, "3x3.get_key")
	assert(testMap.complete, true, "3x3.complete")

	#====================================
	# Size 4 ("normal")
	testMap = GridMap.new(4)
	assert(testMap.map_size, 4, "GridMap.map_size")
	assert(testMap.pretty, ". . . .\n. . . .\n. . . .\n. . . .", "GridMap.pretty")
	assert(testMap.get_key, GridMap::KEY_UNKNOWN, "GridMap.get_key")

	kids = testMap.get_children
	assert(kids.count, 5, "testMap.get_children")
	assert(kids.map{|x|x.arr[0][0]}, [0,1,2,3,4], "get_children")

	twoMap = GridMap.new(4)
	twoMap.fillWith(2)
	twoMap.unset(3,3)
	kids = twoMap.get_children
	assert(kids.count, 3, "twoMap.get_children")
	assert(kids.map{|x|x.get_key}, [2222222222222220,2222222222222221,2222222222222222,], "twoMap get_children > get_key")
	assert(kids.map{|x|x.complete}, [true,true,true], "twoMap get_children > complete")
	assert(twoMap.complete, false, "twoMap.complete after get_children")

	zeroMap = GridMap.new(4)
	zeroMap.fillWith(0)
	assert(zeroMap.pretty, "0 0 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0", "zero map pretty")
	assert(zeroMap.get_key, 0, "zero map get_key")

	# Test deep_copy
	deep = zeroMap.deep_copy
	deep.arr[2][2] = 3
	assert(deep.arr[2][2], 3, "zero map deep copy - copy changed")
	assert(zeroMap.arr[2][2], 0, "zero map deep copy - original unchanged")

	# Test flipping / rotating
	flipMap = GridMap.new(4)
	flipMap.fillWith(0)
	flipMap.arr[0][0] = 4
	flipMap.arr[0][1] = 2
	assert(flipMap.pretty, "4 2 0 0\n0 0 0 0\n0 0 0 0\n0 0 0 0", "flip map pretty")
	assert(flipMap.get_key, 4200000000000000, "flip map get_key")

	# Canonical value should stay the same, even after rotation/flipping.
	expected_canonical = 1100110010001000
	assert(flipMap.canonical_key, expected_canonical, "flipMap canonical_key")

	rot1 = flipMap.tri_rotate
	assert(rot1.get_key, 2000200010001000, "rot1 get_key")
	assert(rot1.canonical_key, expected_canonical, "rot1 canonical_key")

	rot2 = rot1.tri_rotate
	assert(rot2.get_key, 1111110000000000, "rot2 get_key")
	assert(rot2.canonical_key, expected_canonical, "rot2 canonical_key")

	rot3 = rot2.tri_rotate
	assert(rot3.get_key, 4200000000000000, "rot3 get_key - back to original")
	assert(rot3.canonical_key, expected_canonical, "rot3 canonical_key")

	mirror = flipMap.mirror_flip()
	assert(mirror.get_key, 4000200000000000, "flip map get_key")
	assert(mirror.canonical_key, expected_canonical, "mirror canonical_key")
end

# Run the tests
all_tests

# Report how it went
if ($tests_passed == $tests_run)
	puts "All #{$tests_run} tests passed."
else
	puts "Only #{$tests_passed} out of #{$tests_run} tests passed."
end

$end_time = Time.now
puts "Time: #{$end_time - $start_time}s"
