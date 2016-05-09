var assert = require('assert');
var sinon = require('sinon');
var Logger = require('../../lib/Logger');

describe("Logger.addAppender", function(){

	describe("that already exists", function(){
		var parent = new Logger("null");
		parent.appenders = {"info" : [1,2,3]};
		var child = new Logger("paf", parent);

		parent.addAppender("info", 3);

		it("don't add on logger", function(){
			assert.deepEqual([1,2,3], parent.appenders.info);
		});
		it("don't add on children", function(){
			assert.deepEqual([1,2,3], child.appenders.info);
		});
	});

	describe("that already exists on a lower level", function(){
		var log = new Logger("null");
		log.addAppender("debug",1);
		log.addAppender("info", 1);

		it("is now on the good level", function(){
			assert.deepEqual([1], log.appenders.info);
		});
		it("is not removed from the old one", function(){
			assert.deepEqual([1], log.appenders.debug);
		});
	});

	describe("that already exists on a higher level", function(){
		var log = new Logger("null");
		log.addAppender("error",1);
		log.addAppender("info", 1);

		it("is now on the good level", function(){
			assert.deepEqual([1], log.appenders.info);
		});
		it("is not removed from the old one", function(){
			assert.deepEqual([1], log.appenders.error);
		});
	});

	describe("that do not already exist", function(){
		var parent = new Logger("null");
		var child = new Logger("paf", parent);

		parent.addAppender("info", 3);

		it("add on logger", function(){
			assert.deepEqual([3], parent.appenders.info);
		});
		it("add on higher logger", function(){
			assert.deepEqual([3], parent.appenders.warn);
			assert.deepEqual([3], parent.appenders.error);
		});

		it("don't add on lower logger", function(){
			assert.strictEqual(undefined, parent.appenders.debug);
			assert.strictEqual(undefined, parent.appenders.trace);
		});

		it("add on children", function(){
			assert.deepEqual([3], child.appenders.info);
		});
	});
});	
