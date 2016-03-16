# diamond
Scripts to help design a puzzle. May contain spoilers.

This program determines the number of arrangements that fit a set of criteria. There are two ways to define these arrangements:
 
- P(n): The set of tilings of 3n^2 60º rhombuses that fill a regular hexagon.
- Q(n): The set of polycubes that fit in a n^3 box with no overhangs in all 3 axial directions.

These two definitions are equivalent.

### Example Output
```
> ruby diamond_main.rb 
Starting Diamond Program
Building a catalog of all possible maps of size 3.
...
Examined 400 maps; found 152 unique.
  Map 211210210 (new)
3 3 1
3 0 0
0 0 0
Examined 500 maps; found 192 unique.
  Map 322322210 (dupe)
3 2 2
3 2 2
2 1 0
...
...done.
980 maps examined.
226 unique maps were found.
Time: 0.178213s
> 
```
This output has been shortened.