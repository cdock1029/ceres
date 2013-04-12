from pymongo import MongoClient
import pymongo
from bson.code import Code
import json


host = 'localhost'
port = 27017

def countKeyValueRange(start, end, key, value):
	db = MongoClient(host, port).db_test 
	mapString = """function() {
			emit(this.%s, this.%s);
		}""" % (key, value) 	

	reduceString = """function(key, val) {
			return Array.sum(val);
		}"""

	mapFunc = Code(mapString)
	reduceFunc = Code(reduceString)	
	result = db.cities.map_reduce(mapFunc,reduceFunc,"countKeyValueRange")
		#mapFunc, 
		#reduceFunc,
		#"countKeyValueRange")
		#,
		#query={"server_utc": {"$gt": int(start), "$lt": int(end)}}
	output(result) 




def output(result, field="_id", order=pymongo.ASCENDING):
	for doc in result.find().sort(field, order):
		print doc

if __name__ == "__main__":
	countKeyValueRange(101,202,"timezone","population")