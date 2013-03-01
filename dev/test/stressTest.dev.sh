#!/bin/bash
echo "Before"
date
for i in {1..1000}
do
	echo $i
	echo ' ' 
	curl -d @collect1.json http://localhost:8007/collect
done
echo "After"
date
