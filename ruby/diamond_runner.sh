#!/bin/bash
# Runs diamond.rb and tests over and over.
while :;
	do clear;
	ruby diamond_tests.rb; 
	sleep 5;
	ruby diamond_main.rb;
	sleep 5;
done
