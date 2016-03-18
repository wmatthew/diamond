// This is a class that holds a nxn grid of integers.
//   Each integer takes a value (0..n)
//   Some integers may not yet be set.
//
// This is meant to represent a polycube fitting inside an n^3 cube,
// with no overhangs in all 3 axial directions. See README for more
// information on that.

// Usage: don't call this directly; see GridTests.js.

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

exports.GridMap = GridMap;