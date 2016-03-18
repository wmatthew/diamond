#!/usr/bin/env ruby

# This program determines the number of arrangements that fit
# a set of criteria. There are two ways to define these arrangements:
# 
# P(n): The set of tilings of 3n^2 60º rhombuses that fill a regular hexagon.
# Q(n): The set of polycubes that fit in a n^3 box with no overhangs in all 
#       3 axial directions.
#
# These two definitions are equivalent.
#
# Usage: ruby diamond_main.rb -h # display usage information

# Past Results
#=======================
# Size   Uniques   Total       Time
#  1      2         2          <1s
#  2      10        20         <1s
#  3      226       980        <1s
#  4      40,238    232,848    70s
#  5      80M??     250M??     >10min

require './diamond'
require 'optparse'

$verbose = false
$map_size = 3

OptionParser.new do |opts|
  opts.banner = "Usage: diamond_main.rb [-hv] [-n NUM]"

  opts.on("-v", "--verbose", "Run verbosely") do |v|
    $verbose = true
  end

  opts.on("-nNUM", "--num=NUM", "Run with map size NUM") do |n|
    $map_size = n.to_i
  end

  opts.on("-h", "--help", "Display this message") do |v|
    puts opts
    exit
  end

end.parse!

# Hash of distinct canonical_keys for all complete maps encountered so far.
$known_maps = {}
# The number of complete maps found so far (not counting duplicates)
# Finding the size of hash ($known_maps.count) is too slow.
$known_maps_count = 0
# The number of complete maps we've examined so far (counting duplicates)
$examined_maps_count = 0
# The number of lines to erase when updating the console.
$erasable_lines = 0

puts "Starting Diamond Program"
$start_time = Time.now

# Given a list of partial maps, explore the space of all possible completions
# to those maps.
def explore_options(arr_list)
	if (arr_list.empty?)
	  puts "Warning - tried to explore_options on an empty list. Shouldn't happen."
		return arr_list
	end
	
	# Use a stack to keep arr_list size small.
  arr = arr_list.shift
  arr.get_children.each do |kid|

  	if (kid.complete)
			canon = kid.canonical_key
			duplicate = $known_maps.key?(canon)
			$known_maps[canon] = true
			$examined_maps_count = $examined_maps_count + 1
			if (!duplicate) 
				$known_maps_count = $known_maps_count + 1
			end

			if ($examined_maps_count % 100 == 0)
				clear_console()
			  puts "Examined #{$examined_maps_count} maps; found #{$known_maps_count} unique."
			  puts "  Map #{canon} (#{duplicate ? "dupe" : "new" })"
		  	puts kid.pretty
		  	$erasable_lines = $erasable_lines + 2 + arr.map_size
	  	end
  	else
  	  arr_list.unshift(kid)
    end

  end
  arr_list
end

# Clear erasable lines and reset the line counter.
# Useful when displaying progress (rapidly changing stats / map)
def clear_console()
	if ($verbose)
		return
	end

	print "\r" # move to start of line
	(1..$erasable_lines).each do
		print "\e[A" # move up
	end
	print "\e[J" # clear until end
	$erasable_lines = 0
end

# Explore the space of all possible maps, starting with an empty
# (not filled in) map. Report on progress as you go.
def do_search(map_size)
	puts "Building a catalog of all possible maps of size #{map_size}."
  partials = [GridMap.new(map_size)]
  while (!partials.empty?) do
    partials = explore_options(partials)
  end
  clear_console
  puts "...done."
  puts "#{$examined_maps_count} maps examined."
  puts "#{$known_maps_count} unique maps were found."
end

do_search($map_size)

$end_time = Time.now
puts "Time: #{$end_time - $start_time}s"
