var Logger = require('./Logger');

var rootLogger = new Logger("", null);

function getOrCreate(fullName){
	var result = rootLogger;

	if(!fullName || fullName === ""){
		return result;
	}

	var names = fullName.split(".");

	for(var i=0;i<names.length;i++){
		if(!result.children[names[i]]){
			result.children[names[i]] = new Logger(fullName, result);
		}
		result = result.children[names[i]];
	}
	return result;
}

module.exports  = {
	name : require('../package.json').name,
	version : require('../package.json').version,

	get : getOrCreate
};
