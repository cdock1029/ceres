#!/bin/bash
echo "Before"
date
for i in {1..500}
do
	curl -d @collect1.json http://localhost:8888/collect
done
echo "After"
date
