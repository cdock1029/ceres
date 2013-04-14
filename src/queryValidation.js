/** 
NOTE: This function is to be inplemted by the user to verify that the data
fits the schema for this application.</br>
Purpose: This method is to validate the data and return boolean. 
@module queryValidation
**/
exports.validate = function validate(data, func) {
	
	//define behavior of this function here
	var err = false;
	func(err);
}