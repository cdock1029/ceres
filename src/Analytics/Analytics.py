import sys
import ast
import datetime
import math
from pymongo import MongoClient

def totalCount():
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	return collection.count()

def countRange(startTime, endTime):
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
	return collection.find(timeComponent).count();

def meanFunction(startTime, endTime, expression):
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	length = float(endTime) - float(startTime);
	argumentComponent = ast.literal_eval(expression);
	timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
	timeComponent.update(argumentComponent);
	
	recordCount = collection.find(timeComponent).count();	
	
	if recordCount > 0:
		result = length/float(recordCount);
		output = "The mean insertion rate was " + str(result) + " ms per record.";
	else:
		output = "There were no records found during this time that match expression criteria";
	print(output);
	return;
	
#in progress
def minFunction(startTime, endTime, period, expression):
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	print(periodCount);
	while periodCount > i:
		test = collection.find({"server_utc":{ "$gt": 1363297271273 , "$lt": 1363297271711},"data.name.first": "Test", "data.name.last": "Borysov"}).count();	
		print(test);
		i = i + 1;	
	return;

def countController(argv):
	if (len(sys.argv)-2) == 0:
		print(totalCount());
	elif (len(sys.argv)-2) == 2:
		print(countRange(argv[2],argv[3]))
	else:
		print('Invalid Number of Arguments for the type "Count"');
	return;
	
def controller(argv):
	if argv[1] == 'count':
		countController(argv);
	elif argv[1] == 'mean':
		if (len(sys.argv)-2) == 3:
			meanFunction(sys.argv[2],sys.argv[3],sys.argv[4]);
		else:
			print('Invalid Number of Arguments for the type "Mean"');
	elif argv[1] == 'min':
		print('mmk');
		#	collection.find_one();
	elif argv[1] == 'max':
		print('mmk');
	elif argv[1] == 'median':
		print('mmk');
	elif argv[1] == 'var':
		print('mmk');
	elif argv[1] == 'covar':
		print('mmk');
	else:
		print('Invalid command entered.');
	return;

#to call the application: 
# python Analytics.py [tag] [parameters]
controller(sys.argv);