// This program determines the number of arrangements that fit
// a set of criteria. There are two ways to define these arrangements:
// 
// P(n): The set of tilings of 3n^2 60º rhombuses that fill a regular hexagon.
// Q(n): The set of polycubes that fit in a n^3 box with no overhangs in all 
//       3 axial directions.
//
// These two definitions are equivalent.
//
// Usage: node ExploreMaps.js

// Past Results
//=======================
// Size   Uniques   Total       Time
//  1      2         2           7 ms
//  2      10        20         10 ms
//  3      226       980        75 ms
//  4      40,238    232,848    18 s
//  5      80M??     250M??     TBD

var GridMap = require('./GridMap.js').GridMap;
console.time("explore");

var verbose = false; // TODO: make it an arg?
var map_size = 5; // TODO: make it an arg?
var known_maps = [];
var known_maps_count = 0;
var examined_maps_count = 0;
var erasable_lines = 0;

function explore_options(arr_list) {
	if (arr_list.length == 0) {
		console.log("Warning - tried to explore_options on an empty list. Shouldn't happen.");
		return [];
	}

  // Use a stack to keep arr_list size small.
  var arr = arr_list.shift();
  var kids = arr.get_children();

  for (kid of kids) {
  	if (kid.complete) {
  		var canon = kid.canonical_key();
  		var duplicate = known_maps[canon] === true;
  		known_maps[canon] = true;
  		examined_maps_count ++;
  		if (!duplicate) {
  			known_maps_count ++;
  		}
  		if (examined_maps_count % 1000 == 0) {
  			clear_console();
  			console.log("Examined " + examined_maps_count + " maps; found " + known_maps_count + " unique.");
  			console.log(kid.pretty());
  			erasable_lines += 2 + map_size;
  		}
  	} else {
  		arr_list.unshift(kid);
  	}

  }
  return arr_list;
}

function clear_console() {
	if (verbose) return;

	console.log("\r"); // move to start of line
	for (var i=0; i<erasable_lines; i++) {
		process.stdout.write("\x1B[A"); // move up
	}
	process.stdout.write("\x1B[J"); // clear until end
	erasable_lines = 0;
}

function do_search(map_size) {
	console.log("Building a catalog of all possible maps of size " + map_size + ".");
  var partials = [new GridMap(map_size)];
  while (partials.length > 0) {
    partials = explore_options(partials);
  }
  console.log("...done.");
  console.log(examined_maps_count + " maps examined.");
  console.log(known_maps_count + " unique maps were found.");
}

do_search(map_size);

console.timeEnd("explore");