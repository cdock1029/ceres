#!/bin/bash
echo "Before"
date
for i in {1..1000}
do
	curl -d @collect1.json http://localhost:8007/collect
done
echo "After"
date
