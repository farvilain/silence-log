const os = require('os');
const Logger = require('./Logger');

const APP = {name:undefined, version:undefined, env:undefined, host:os.hostname()};
const rootLogger = new Logger("", null, APP);

const factory = {
	name : require('../package.json').name,
	version : require('../package.json').version,
};

factory.app = app => {
	if( typeof app === 'undefined') return APP;
	Object.assign(APP, app);
	return factory;
};


factory.get = fullName => {
	var result = rootLogger;

	if(!fullName || fullName === ""){
		return result;
	}

	var names = fullName.split(".");

	for(var i=0;i<names.length;i++){
		if(!result.children[names[i]]){
			result.children[names[i]] = new Logger(fullName, result, APP);
		}
		result = result.children[names[i]];
	}
	return result;
};

module.exports = factory;