function getAcceptedLevels(level){
	switch(level){
		case "trace" :
			return ['trace','debug','info','warn','error'];
		case "debug" :
			return ['debug','info','warn','error'];
		case "info" :
			return ['info','warn','error'];
		case "warn" :
			return ['warn','error'];
		case "error" : 
			return ['error'];
		default :
			return [];
	}
}

function Logger(name, parent){
	this.name = name;
	this.parent = parent || null;
	this.children = [];
	this.appenders = {};


	if(this.parent){
		this.parent.children.push(this);
		thisLogger = this;
		Object.keys(this.parent.appenders).forEach( function (level) {
			thisLogger.appenders[level] = parent.appenders[level].slice();
		});
	}

}

Logger.prototype.addAppender = function (level, appender) {
	if(!this.appenders[level]){
		this.appenders[level] = [];
	}

	if( this.appenders[level].indexOf(appender) === -1){
		this.appenders[level].push(appender);
	}

	this.children.forEach(function(child){
		child.addAppender(level, appender);
	});

	return this;
};

Logger.prototype.removeAppender = function (level, appender) {
	if(this.appenders[level]){
		var index = this.appenders[level].indexOf(appender);
		if( index !== -1){
			this.appenders[level].splice(index, 1);
		}
	}

	this.children.forEach(function(child){
		child.removeAppender(level, appender);
	});

	return this;
};

Logger.prototype.log = function (level, msg){
	var allAppenders = [];

	var thisLogger = this;
	getAcceptedLevels(level).forEach(function(l){
		if(!thisLogger.appenders[l]){
			return;
		}
		thisLogger.appenders[l].forEach(function(a){
			if(allAppenders.indexOf(a) === -1){
				allAppenders.push(a);
			}
		});
	});

	var loggerName = this.name;
	allAppenders.forEach(function(a){
		a.log(loggerName, level, msg);
	});

	return this;
};

Logger.prototype.error = function(msg){
	return this.log("error",msg);
};

Logger.prototype.warn = function(msg){
	return this.log("warn",msg);
};

Logger.prototype.info = function(msg){
	return this.log("info",msg);
};

Logger.prototype.debug = function(msg){
	return this.log("debug",msg);
};

Logger.prototype.trace = function(msg){
	return this.log("trace",msg);
};

module.exports = Logger;
