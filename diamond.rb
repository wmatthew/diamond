# This is a class that holds a nxn grid of integers.
#   Each integer takes a value (0..n)
#   Some integers may not yet be set.
#
# This is meant to represent a polycube fitting inside an n^3 cube,
# with no overhangs in all 3 axial directions.

# Usage: don't call this directly; see diamond_tests.rb and diamond_main.rb.

class GridMap
  VALUE_NOT_SET = -1
  KEY_UNKNOWN = -2

  # 2D array of integers.
  attr :arr
  # Size of the array of values.
  attr :map_size
  # Is the map completely filled in?
  attr :complete
  
  def initialize(n)
  	@map_size = n
    row = Array.new(@map_size, VALUE_NOT_SET)
    @arr = []
    (0...n).each do |x|
      @arr[x] = row.clone
    end
    @complete = false
  end

  # Set all unset values to the specified value.
  def fillWith(val)
		coord.each do |x|
			coord.each do |y|
				if (@arr[x][y] == VALUE_NOT_SET)
  				@arr[x][y] = val
  			end
			end
		end
		@complete = true
  end

  # Display-friendly printout
  def pretty
	  @arr.map{ |row|
	  	row.map{ |a| (a == VALUE_NOT_SET) ? '.' : a }.join(' ')
  	}.join("\n")
  end

  # Compact version
  def get_key()
  	if (!complete)
  		KEY_UNKNOWN
  	else
	    @arr.map{ |x| x.join }.join().to_i
	  end
  end

	def deep_copy()
		Marshal.load(Marshal.dump(self))
	end

  # Return a new GridMap that is a mirror-image of this.
  #   reflection is over the x=y plane.
	def mirror_flip()
		mirror = deep_copy
		coord.each do |x|
	  	coord.each do |y|
	  		mirror.arr[x][y] = @arr[y][x]
	  	end
	  end
	  mirror
	end

  # Return a new GridMap that is a rotated version of this.
  #   120º rotation around vector <1,1,1>
	def tri_rotate()
		rot = deep_copy
		coord.each do |x|
	  	coord.each do |y|
	  		rot.arr[x][y] = @arr[y].select{ |a| a > x }.count
	  	end
	  end
	  rot
	end	

  # This unique identifier is unchanged by rotation and reflection.
  # It is useful for deduplication: two maps are isomorphic iff their
  # canonical_keys are the same.
	def canonical_key()
	  rot1 = tri_rotate
	  rot2 = rot1.tri_rotate

		key1 = get_key
	  key2 = rot1.get_key
		key3 = rot2.get_key
		key4 = mirror_flip.get_key
	  key5 = rot1.mirror_flip.get_key
		key6 = rot2.mirror_flip.get_key

	  [key1, key2, key3, key4, key5, key6].min
	end

  # A safe-ish way to set values and have complete be updated properly.
  # Assumes the grid is being filled in order (if it's not, @complete may be incorrect)
  def set(x, y, val)
  	@arr[x][y] = val
  	if (x==coord_max && y==coord_max)
  		@complete = true
  	end
  end

  # A safe way to unset values and have complete be updated properly.
  def unset(x, y)
  	@arr[x][y] = VALUE_NOT_SET
		@complete = false
  end

	# return an array of possible successors
	def get_children()
	  found_frontier = false
	  frontier_x = -1
	  frontier_y = -1
	  candidates = []
		coord.each do |x|
	  	coord.each do |y|
	  		if (@arr[x][y] < 0 && !found_frontier)
	  			max_x = (x == 0) ? @map_size : @arr[x-1][y]
	  			max_y = (y == 0) ? @map_size : @arr[x][y-1]
	  			candidates = 0..[max_x, max_y].min
	  			found_frontier = true
	  			frontier_x = x
	  			frontier_y = y
	  		end
		  end
		end

		if (!found_frontier || complete)
      puts "Warning- tried to get children on full map. Shouldn't happen."
      return []
		end

	  candidates.map { |candidate|
	    child = deep_copy
	    child.set(frontier_x, frontier_y, candidate)
	    child
	  }
	end

  private

  # The range of possible values of x and y coordinates. Useful for iterating.
  def coord
  	(0...@map_size)
  end

  # The largest possible value of x and y coordinates. Useful for boundary testing.
  def coord_max
   @map_size - 1
  end
end
