# Analytics portion of the CERES application. 
#
# Contributors: Serge Borysov, Conor Dockry, Amasi El-Bakush, Dave Hewitt, Aneeth Krishnamoorthy
# Sponcored By: The Ohio State University and Yesgoody, Inc. 
#
# Description: 
#	A python script responsible for MongoDb database analysis. Displays the data related to the rate of change in 
#	data insertion into the database. 
#
# Usage:
#	python Analytics.py [functionName] [startTime] [endTime] [period] [expression]
# @param: {str} functionName - String name representing the desired function name - eg min, max, count.
# @param: {int} startTime - Integer value representing a 13 digit Unix Time designating the start time of the analysis.
# @param: {int} endTime - Integer value representing a 13 digit Unix Time designating the end time for the analysis.
# @param: {int} period - Integer value representing the 'period' over which rate of change is determined. 
# @param: {Node} expression - Expression data used to query the database formated as a python node. 


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
	result = 0;
	try:
		argumentComponent = ast.literal_eval(expression);
		timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
		timeComponent.update(argumentComponent);
		result = collection.find(timeComponent).count();
	except: 
		print ('ERROR: Unable to parse the passed in expression.');
	return result;

def meanFunction(startTime, endTime, expression):
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	
	result = 0;
	length = float(endTime) - float(startTime);
	try:
		argumentComponent = ast.literal_eval(expression);
		timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
		timeComponent.update(argumentComponent);
		
		recordCount = collection.find(timeComponent).count();	
		
		if recordCount > 0:
			result = length/float(recordCount);
		else:
			output = "There were no records found during this time that match expression criteria";	
	except: 
		print ('ERROR: Unable to parse the passed in expression.');
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

def argumentChecker(startTime, endTime):
	try:	
		startVal = int(startTime);
		endVal = int(endTime);
		if (startVal < endVal):
			return True;
		else:
			print('Passed in end time value is smaller than the start time');
	except ValueError:
		print('Input is not a valid integer');
	return False;

def fullArgumentChecker(startTime, endTime, period):
	try: 
		periodVal = int(period);
		if periodVal != 0:
			return argumentChecker(startTime,endTime);
		else:
			print('Period cannot be 0.')
	except ValueError:
		print('Period value is not an integer');	
	return False;
	
def countController(argv):
	if (len(sys.argv)-2) == 0:
		print(totalCount());
	elif (len(sys.argv)-2) == 3:
		correct = argumentChecker(sys.argv[2],sys.argv[3]);
		if correct == True:
			print(countRange(argv[2],argv[3],argv[4]));
	else:
		print('Invalid Number of Arguments for the type "Count"');
	return;
	
def controller(argv):
	if len(sys.argv) > 1:
		if argv[1] == 'count':
			countController(argv);
		elif argv[1] == 'mean':
			if (len(sys.argv)-2) == 3:
				correct = argumentChecker(sys.argv[2],sys.argv[3]);
				if correct == True:
					meanTime = meanFunction(sys.argv[2],sys.argv[3],sys.argv[4]);
					print(meanTime);
			else:
				print('Invalid Number of Arguments for the type "Mean"');
		elif argv[1] == 'min':
			if (len(sys.argv)-2) == 4:
				correct = fullArgumentChecker(sys.argv[2],sys.argv[3],sys.argv[4]);
				if correct == True:
					minTime = minFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
					print(minTime);
			else:
				print('Invalid Number of Arguments for the type "Min"');
		elif argv[1] == 'max':
			if (len(sys.argv)-2) == 4:
				correct = fullArgumentChecker(sys.argv[2],sys.argv[3],sys.argv[4]);
				if correct == True:
					maxTime = maxFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
					print(maxTime);
			else:
				print('Invalid Number of Arguments for the type "Max"');
		elif argv[1] == 'var':
			if (len(sys.argv)-2) == 4:
				correct = fullArgumentChecker(sys.argv[2],sys.argv[3],sys.argv[4]);
				if correct == True:
					varTime = varFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
					print(varTime);
			else:
				print('Invalid Number of Arguments for the type "Variance"(var)');
		elif argv[1] == 'std':
			if (len(sys.argv)-2) == 4:
				correct = fullArgumentChecker(sys.argv[2],sys.argv[3],sys.argv[4]);
				if correct == True:
					stdTime = stdFunction(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5]);
					print(stdTime);
			else:
				print('Invalid Number of Arguments for the type "Standard Deviation"(std)');
		else:
			print('Invalid command entered.');
	else:
		print('Please enter a command.');
	return;

controller(sys.argv);