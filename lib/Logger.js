var LogLevel = require('./LogLevel');

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
	var thisLogger = this;

	Object
	.keys(this.appenders)
	.filter(function (l){
		return l !== level;
	})
	.filter(function (l){
		return thisLogger.appenders[l];
	})
	.forEach(function (l){
		var index = thisLogger.appenders[l].indexOf(appender);
		if(index !== -1){
			thisLogger.appenders[l].splice(index, 1);
		}
	});
	
	if(!thisLogger.appenders[level]){
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

Logger.prototype.log = function (level){
	var allAppenders = [];

	var thisLogger = this;
	LogLevel[level].lte.forEach(function(l){
		if(!thisLogger.appenders[l]){
			return;
		}
		thisLogger.appenders[l].forEach(function(a){
			if(allAppenders.indexOf(a) === -1){
				allAppenders.push(a);
			}
		});
	});

	if(allAppenders.length === 0){
		return this;
	}

	Array.prototype.unshift.call(arguments, this.name);
	var args = arguments;
	allAppenders.forEach(function(a){
		a.log.apply(a, args);
	});

	return this;
};

Logger.prototype.error = function(){
	Array.prototype.unshift.call(arguments, "error");
	return this.log.apply(this, arguments);
};

Logger.prototype.warn = function(){
	Array.prototype.unshift.call(arguments, "warn");
	return this.log.apply(this, arguments);
};

Logger.prototype.info = function(){
	Array.prototype.unshift.call(arguments, "info");
	return this.log.apply(this, arguments);
};

Logger.prototype.debug = function(){
	Array.prototype.unshift.call(arguments, "debug");
	return this.log.apply(this, arguments);

};

Logger.prototype.trace = function(){
	Array.prototype.unshift.call(arguments, "trace");
	return this.log.apply(this, arguments);

};



module.exports = Logger;
