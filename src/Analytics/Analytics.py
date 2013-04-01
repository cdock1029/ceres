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

def countRange(startTime, endTime,expression):
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	argumentComponent = ast.literal_eval(expression);
	timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
	timeComponent.update(argumentComponent);
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
	else:
		result = 0;
		output = "There were no records found during this time that match expression criteria";
	return result;
	
def minFunction(startTime, endTime, period, expression):
	minTime = 999;
	
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	while periodCount > i:
		endTime = int(startTime) + int(period);
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
		
		if avgTime < minTime:
			minTime = avgTime;
		
		i = i + 1;	
	output = "The minimum insertion rate was " + str(minTime) + " ms per record.";
	print(output);
	return minTime;

def maxFunction(startTime, endTime, period, expression):
	maxTime = 0;
	
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	while periodCount > i:
		endTime = int(startTime) + int(period);
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
			
		if avgTime > maxTime:
			maxTime = avgTime;
		
		i = i + 1;	
	output = "The maximum insertion rate was " + str(maxTime) + " ms per record.";
	print(output);
	return maxTime;

def varFunction(startTime, endTime, period, expression):
	varTime = 0;
	totalTime = 0;
	meanTime = meanFunction(startTime, endTime, expression);
	
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	
	argumentComponent = ast.literal_eval(expression);
	while periodCount > i:
		endTime = int(startTime) + int(period);
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
		varTime = (avgTime - meanTime)**2;
		totalTime = totalTime + varTime;
		
		i = i + 1;	

	return totalTime/periodCount;

def stdFunction(startTime, endTime, period, expression):
	stdTime  = math.sqrt(varFunction(startTime, endTime, period, expression));
	return stdTime;

	
def countController(argv):
	if (len(sys.argv)-2) == 0:
		print(totalCount());
	elif (len(sys.argv)-2) == 3:
		print(countRange(argv[2],argv[3],argv[4]))
	else:
		print('Invalid Number of Arguments for the type "Count"');
	return;
	
def controller(argv):
	if argv[1] == 'count':
		countController(argv);
	elif argv[1] == 'mean':
		if (len(sys.argv)-2) == 3:
			meanTime = meanFunction(sys.argv[2],sys.argv[3],sys.argv[4]);
			print(meanTime);
		else:
			print('Invalid Number of Arguments for the type "Mean"');
	elif argv[1] == 'min':
		if (len(sys.argv)-2) == 4:
			minTime = minFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
			print(minTime);
		else:
			print('Invalid Number of Arguments for the type "Min"');
	elif argv[1] == 'max':
		if (len(sys.argv)-2) == 4:
			maxTime = maxFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
			print(maxTime);
		else:
			print('Invalid Number of Arguments for the type "Max"');
	elif argv[1] == 'var':
		if (len(sys.argv)-2) == 4:
			varTime = varFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
			print(varTime);
		else:
			print('Invalid Number of Arguments for the type "Variance"');
	elif argv[1] == 'std':
		if (len(sys.argv)-2) == 4:
			stdTime = stdFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
			print(stdTime);
		else:
			print('Invalid Number of Arguments for the type "Variance"');
	else:
		print('Invalid command entered.');
	return;

controller(sys.argv);