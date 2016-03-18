// usage: node GridMap.js

function GridMap(n) {
	// static constants
  this.VALUE_NOT_SET = -1;
  this.KEY_UNKNOWN = -2;

  // 2D array of integers
  this.arr = new Array(n);
  for (var x = 0; x < n; x++) {
  	this.arr[x] = new Array(n);
	  for (var y = 0; y < n; y++) {
	  	this.arr[x][y] = this.VALUE_NOT_SET;
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
	  	if (this.arr[x][y] == this.VALUE_NOT_SET) {
  	  	this.arr[x][y] = val;
  	  }
	  }
  }
  this.complete = true;
}

GridMap.prototype.pretty = function() {
  return this.arr.map(function(row){return row.join(' ');}).join('\n');
}

GridMap.prototype.get_key = function() {
	if (!this.complete) {
		return this.KEY_UNKNOWN;
	} else {
    return parseInt(this.arr.map(function(row){return row.join('');}).join(''));		
	}
}

var simpleMap = new GridMap(3);
console.log("Blank map: \n" + simpleMap.pretty());

simpleMap.fillWith(2);
console.log("Filled with 2s: \n" + simpleMap.pretty());
console.log("Filled with 2s KEY: \n" + simpleMap.get_key());