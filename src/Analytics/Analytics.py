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

# 	Description: Function responsible for returning the total number of items in a collection.
# 	Ensures: An integer value is returned to the user.
#	Returns: Number of records in the collection.
def totalCount():
	# Establish a connection.
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	# Return the value.
	return collection.count()

#	Description: Function responsible for returning the total number of items inserted into the collection
# 		over the range of between start time and end time. The number is further refined with an expression
#		representing a user query.
#	Requires: startTime < endTime
# 	Returns: An integer value representing a number of records in the database or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.
def countRange(startTime, endTime, expression):
	#Establish a connection
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	result = 0;
	try:
		# Convert from 'str' parameter to a 'Node' expression.
		argumentComponent = ast.literal_eval(expression);
		timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
		# Concatenate the refinement onto the range component.
		timeComponent.update(argumentComponent);
		result = collection.find(timeComponent).count();
	except: 
		print ('ERROR: Unable to parse the passed in expression.');
	return result;

#	Description: Function responsible for computing the average time of an insertion. 
#	Requires: startTime < endTime
# 	Returns: An integer value representing a number of records in the database or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.
def meanFunction(startTime, endTime, expression):
	# Establish a connection
	connection = MongoClient();
	db = connection.test_db;
	collection = db.test_collection;
	
	result = 0;
	# Determine the total ammount of time in the range.
	length = float(endTime) - float(startTime);
	try:
		# Convert from 'str' parameter to a 'Node' expression.
		argumentComponent = ast.literal_eval(expression);
		timeComponent = {"server_utc":{ "$gt": int(startTime) , "$lt": int(endTime)}};
		# Concatenate the refinement onto the range component.
		timeComponent.update(argumentComponent);
		
		recordCount = collection.find(timeComponent).count();	
		# Ensures no divisions by 0. 
		if recordCount > 0:
			result = length/float(recordCount);
		else:
			output = "There were no records found during this time that match expression criteria";	
	except: 
		print ('ERROR: Unable to parse the passed in expression.');
	return result;

#	Description: Function responsible for computing the minimum insertion time of records over a period of time.
#	Requires: period < startTime < endTime
# 	Returns: An integer value representing a minumum insertion time over a period in the database, or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
#	Param: {int} period - Integer value representing the number of nano seconds wished to be tested.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.	
def minFunction(startTime, endTime, period, expression):
	minTime = 999;
	
	# Determine the number of periods wished to be tested. 
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	while periodCount > i:
		endTime = int(startTime) + int(period);
		# Get the count in the specific range
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		# Make sure that there is no division by zero.
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
		# Get the minimum value.
		if avgTime < minTime:
			minTime = avgTime;
		
		i = i + 1;	
	output = "The minimum insertion rate was " + str(minTime) + " ms per record.";
	print(output);
	return minTime;

#	Description: Function responsible for computing the maximum insertion time of records over a period of time.
#	Requires: period < startTime < endTime
# 	Returns: An integer value representing a maximum insertion time over a period in the database, or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
#	Param: {int} period - Integer value representing the number of nano seconds wished to be tested.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.	

def maxFunction(startTime, endTime, period, expression):
	maxTime = 0;
	# Determine the number of periods wished to be tested. 
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	while periodCount > i:
		endTime = int(startTime) + int(period);
		# Get the count in the specific range
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		# Make sure that there is no division by zero.
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
		# Get the maximum value.	
		if avgTime > maxTime:
			maxTime = avgTime;
		
		i = i + 1;	
	output = "The maximum insertion rate was " + str(maxTime) + " ms per record.";
	print(output);
	return maxTime;

#	Description: Function responsible for computing the variance of the insertion time of records over a period of time.
#	Requires: period < startTime < endTime
# 	Returns: An integer value representing a variance of the insertion time over a period in the database, or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
#	Param: {int} period - Integer value representing the number of nano seconds wished to be tested.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.	

def varFunction(startTime, endTime, period, expression):
	varTime = 0;
	totalTime = 0;
	meanTime = meanFunction(startTime, endTime, expression);
	# Determine the number of periods wished to be tested. 
	periodCount = math.ceil((float(endTime) - float(startTime))/int(period));
	i = 0;
	
	argumentComponent = ast.literal_eval(expression);
	while periodCount > i:
		endTime = int(startTime) + int(period);
		# Get the count in the specific range
		recordCount = countRange(startTime, endTime, expression);
		startTime = int(startTime) + int(period);
		# Make sure that there is no division by zero.
		if recordCount == 0:
			avgTime = 0;
		else:
			avgTime = float(period)/recordCount;
		# Compute the variance
		varTime = (avgTime - meanTime)**2;
		totalTime = totalTime + varTime;
		
		i = i + 1;	

	return totalTime/periodCount;

	
#	Description: Function responsible for computing the standard deviation of the insertion time of records over a 
#   period of time.
#	Requires: period < startTime < endTime
# 	Returns: An integer value representing a std of the insertion time over a period in the database, or an error message.
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
#	Param: {int} period - Integer value representing the number of nano seconds wished to be tested.
# 	Param: {str} expression - A NODE parameter representing a refinement of a query, encoded as a string.	
def stdFunction(startTime, endTime, period, expression):
	stdTime  = math.sqrt(varFunction(startTime, endTime, period, expression));
	return stdTime;

#	Description: Function responsible for checking the correctness of the input. 
#	Requires: startTime < endTime
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
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

#	Description: Function responsible for checking the correctness of the input. 
#	Requires: period < startTime < endTime
#	Param: {int} startTime - Integer value representing the time stamp of beginning of a range.
# 	Param: {int} endTime - Integer value representing the time stamp of ending of a range.
#	Param: {int} period - Integer value representing the number of nano seconds wished to be tested.
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

# 	Description: Function responsible for assigning which count function the user called.
#	Param: {array} argv - List of arguments passed into the script.
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

# 	Description: Function responsible for assigning which function the user called.
#	Param: {array} argv - List of arguments passed into the script.	
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

# Call the controller function. 
controller(sys.argv);