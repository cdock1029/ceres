#!/bin/bash

#the number of records
NUM_RECORDS=1;

echo "Testing Delete..."
	# successful (need to update Object id in each json file whenever it is added to the data base)
	 #node testrunner.js DELETE localhost 8880 /data delete1.json $NUM_RECORDS & 
	 #node testrunner.js DELETE localhost 8880 /data delete2.json $NUM_RECORDS & 
	 #node testrunner.js DELETE localhost 8880 /data delete3.json $NUM_RECORDS & 
	 #node testrunner.js DELETE localhost 8880 /data delete4.json $NUM_RECORDS & 
	 
	 #improper format error
	 #node testrunner.js DELETE localhost 8880 /data delete-no-objid.json $NUM_RECORDS & 
	 #node testrunner.js DELETE localhost 8880 /data delete-no-Authid.json $NUM_RECORDS & 
	 #node testrunner.js DELETE localhost 8880 /data delete-misspelled.json $NUM_RECORDS & 
	 
	 # huge angry socket error
	 node testrunner.js DELETE localhost 8880 /data delete-empty-id.json $NUM_RECORDS & 
	 
	 # this should output no response
	 #node testrunner.js DELETE localhost 8880 /data delete-no-ids.json $NUM_RECORDS & 
	 
	 #(success) but Nothing gets deleted because this id does not exist
	 #node testrunner.js DELETE localhost 8880 /data delete-wrong-objid.json $NUM_RECORDS & 
	 
exit 0	 