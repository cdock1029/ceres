#!/bin/bash
#the number of simultaneous clients
NUM_CLIENTS=100;
#the number of records for each client to insert
NUM_RECORDS=100;
echo "Before"
date
for i in $(seq 1 $NUM_CLIENTS)
do
	echo $i
	 node testrunner.js POST localhost 8888 /collect collect1.json $NUM_RECORDS & 
done
echo "After"
date
