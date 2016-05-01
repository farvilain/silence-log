var EventEmitter = require('events');
var util = require('util');

var LogLevel = require('./LogLevel');

function Logger(name, parent){
	EventEmitter.call(this);

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
util.inherits(Logger, EventEmitter);


Logger.prototype.addAppender = function (level, appender) {
	if(!LogLevel[level]){
		throw new Error("Unknow level:"+level);
	}

	var thisLogger = this;

	LogLevel[level].gte.forEach(function(l){
		thisLogger.appenders[l] = thisLogger.appenders[l] || [];

		var index = thisLogger.appenders[l].indexOf(appender);
		if(index === -1){
			thisLogger.appenders[l].push(appender);
		}
	});

	LogLevel[level].lt.forEach(function(l){
		if(!thisLogger.appenders[l]){
			return;
		}

		var index = thisLogger.appenders[l].indexOf(appender);
		if(index !== -1){
			thisLogger.appenders[l].slice(index, 1);
		}
	});

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
	if(!this.appenders[level] || this.appenders[level].length === 0){
		return this;
	}

	var thisLogger = this;

	var l = level;
	Array.prototype.unshift.call(arguments, this.name);
	var args = arguments;
	this.appenders[l].forEach(function(a){
		try{
			a.log.apply(a, args);
		} catch(e){
			thisLogger.emit("error", e);
		}
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
