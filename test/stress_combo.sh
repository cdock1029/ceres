#!/bin/bash
#the number of simultaneous clients
NUM_CLIENTS=10;
#the number of records for each client to insert
NUM_RECORDS=100;
echo "Before"
date
./stress2.sh & ./stress3.sh & ./stress4.sh & ./stress5.sh
echo "After"
date
