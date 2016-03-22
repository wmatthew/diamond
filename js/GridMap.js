// This is a class that holds a nxn grid of integers.
//   Each integer takes a value (0..n)
//   Some integers may not yet be set.
//
// This is meant to represent a polycube fitting inside an n^3 cube,
// with no overhangs in all 3 axial directions. See README for more
// information on that.

// Usage: don't call this directly; see GridTests.js and ExploreMaps.js

function GridMap(n) {
	// static constants
  GridMap.prototype.VALUE_NOT_SET = -1;
  GridMap.prototype.KEY_UNKNOWN = -2;

  // 2D array of integers
  this.arr = new Array(n);
  for (var x = 0; x < n; x++) {
  	this.arr[x] = new Array(n);
	  for (var y = 0; y < n; y++) {
	  	this.arr[x][y] = GridMap.prototype.VALUE_NOT_SET;
	  }
  }

  // Size of the 2D array.
  this.map_size = n;

  // The largest possible value of x and y coordinates. Useful for boundary testing.
  this.coord_max = n-1;

  // Is the map filled in?
  this.complete = false;
};

GridMap.prototype.fillWith = function(val) {
  for (var x = 0; x < this.map_size; x++) {
	  for (var y = 0; y < this.map_size; y++) {
	  	if (this.arr[x][y] == GridMap.prototype.VALUE_NOT_SET) {
  	  	this.arr[x][y] = val;
  	  }
	  }
  }
  this.complete = true;
}

GridMap.prototype.pretty = function() {
  return this.arr.map(
    function(row) {return row.map(
      function(cell) {return (cell === GridMap.prototype.VALUE_NOT_SET) ? '.' : cell;}
    ).join(' ');}
  ).join('\n');
}

GridMap.prototype.get_key = function() {
	if (!this.complete) {
		return GridMap.prototype.KEY_UNKNOWN;
	} else {
    return parseInt(this.arr.map(function(row){return row.join('');}).join(''));		
	}
}

// A safe-ish way to set values and have complete be updated properly.
// Assumes the grid is being filled in order (if it's not, complete may be incorrect)
GridMap.prototype.set = function(x, y, val) {
  this.arr[x][y] = val
  if (x == this.coord_max && y == this.coord_max) {
    this.complete = true;
  } 
}

// A safe way to unset values and have complete be updated properly.
GridMap.prototype.unset = function(x, y) {
  this.arr[x][y] = GridMap.prototype.VALUE_NOT_SET;
  this.complete = false;
}

GridMap.prototype.get = function(x, y) {
  return this.arr[x][y];
}

// return an array of possible successors
GridMap.prototype.get_children = function() {
  var found_frontier = false;
  var frontier_x = -1;
  var frontier_y = -1;
  candidates = [];

  for (var x = 0; x < this.map_size; x++) {
    for (var y = 0; y < this.map_size; y++) {
      if (this.arr[x][y] < 0 && !found_frontier) {
        var max_x = (x == 0) ? this.map_size : this.arr[x-1][y];
        var max_y = (y == 0) ? this.map_size : this.arr[x][y-1];
        var candidates = [];
        for (var i = 0; i <= Math.min(max_x, max_y); i++) {
          candidates.push(i);
        }
        found_frontier = true;
        frontier_x = x;
        frontier_y = y;
      }
    }
  }

  if (!found_frontier || this.complete) {
    console.log("Warning- tried to get children on full map. Shouldn't happen.");
    return [];
  }

  var obj = this;

  return candidates.map(function(candidate) {
    var child = obj.deep_copy();
    child.set(frontier_x, frontier_y, candidate);
    return child;
  });
}

GridMap.prototype.deep_copy = function() {
  var copy = new GridMap(this.map_size);
  for (var x = 0; x < this.map_size; x++) {
    for (var y = 0; y < this.map_size; y++) {
      copy.arr[x][y] = this.arr[x][y];
    }
  }
  copy.complete = this.complete;
  return copy;
}

GridMap.prototype.mirror_flip = function() {
  var mirror = this.deep_copy();
  for (var x = 0; x < this.map_size; x++) {
    for (var y = 0; y < this.map_size; y++) {
      mirror.arr[x][y] = this.arr[y][x];
    }
  }
  return mirror;
}

GridMap.prototype.tri_rotate = function() {
  var rot = this.deep_copy();
  for (var x = 0; x < this.map_size; x++) {
    for (var y = 0; y < this.map_size; y++) {
      rot.arr[x][y] = this.arr[y].filter(function(a) {return a > x;}).length;
    }
  }
  return rot;
}

GridMap.prototype.canonical_key = function() {
    var rot1 = this.tri_rotate();
    var rot2 = rot1.tri_rotate();

    var key1 = this.get_key();
    var key2 = rot1.get_key();
    var key3 = rot2.get_key();
    var key4 = this.mirror_flip().get_key();
    var key5 = rot1.mirror_flip().get_key();
    var key6 = rot2.mirror_flip().get_key();

    return Math.min(key1, key2, key3, key4, key5, key6);
}

exports.GridMap = GridMap;