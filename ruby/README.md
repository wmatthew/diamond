# Diamond: Ruby Scripts
The first iteration of this project was done in Ruby; these scripts have since been ported to JavaScript. These are kept around for comparative purposes.

- diamond.rb (GridMap.js)- container class representing an nxn grid of integers.
- diamond_main.rb (ExploreMaps.js) - explore and count all possible grids conforming to certain rules.
- diamond_tests.rb (GridTests.js) - unit tests for the GridMap container class.
- diamond_runner.sh (not ported) - shell script to run tests and main class repeatedly.

## Performance
The JavaScript versions of these scripts run substantially faster. For example, fully exploring all 4x4 grids (non-verbose mode) took 70s in Ruby; it takes 18 seconds in JavaScript (run with node).

## Example Output
```
> ruby diamond_main.rb -n 4 -v
Starting Diamond Program
Building a catalog of all possible maps of size 4.

...

Examined 109100 maps; found 33075 unique.
  Map 3331331133102100 (new)
4 4 3 2
4 3 1 0
3 3 1 0
0 0 0 0
Examined 109200 maps; found 33129 unique.
  Map 4222422232212110 (dupe)
4 4 3 2
4 3 0 0
4 3 0 0
3 2 0 0

...

...done.
232848 maps examined.
40238 unique maps were found.
Time: 75.582515s
> 
```
This output has been shortened for clarity.