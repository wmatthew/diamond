# Diamond
A collection of scripts to help design a puzzle. Contains puzzle spoilers.

## Concepts
These programs explore the arrangements that fit a set of criteria. There are two ways to define these arrangements:
 
- P(n): The set of tilings of 3n^2 60º rhombuses that fill a regular hexagon.
- Q(n): The set of [polycubes](https://en.wikipedia.org/wiki/Polycube) that fit in a n^3 box with no overhangs in all 3 axial directions.

These sets are equivalent; an [isometric projection](https://en.wikipedia.org/wiki/Isometric_projection) of a valid polycube will always form a rhombuses-in-hexagon tiling, and vice versa.

## Scripts
The script ExploreMaps.js explores all possible arrangements, displaying the arrangements ('maps') as it examines them. For each map it generates a canonical key that is invariant across rotation and mirroring; it stores these keys and uses them to tell if maps are unique or transformed duplicates of previously seen maps.

The final report shows the number of maps examined and the number of unique maps found.

### Example Output
```
> node ExploreMaps.js
Starting Diamond Program
Building a catalog of all possible maps of size 4.

...

Examined 190000 maps; found 39485 unique.
4 3 2 1
4 2 1 1
4 2 1 1
4 0 0 0

...

...done.
232848 maps examined.
40238 unique maps were found.
explore: 15820ms
> 
```
This output has been shortened.