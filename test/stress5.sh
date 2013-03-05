#!/bin/bash
#the number of simultaneous clients
NUM_CLIENTS=10;
#the number of records for each client to insert
NUM_RECORDS=100;
echo "Before"
date
for i in {1..5}
do
	 #node testrunner.js POST localhost 8007 /collect collect1.json $NUM_RECORDS &
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect &
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect &
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect &
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect &
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect & 
curl -d @collect1b.json ec2-50-19-159-96.compute-1.amazonaws.com:8007/collect 

done
echo "After"
date
