var assert = require('assert');
var sinon = require('sinon');
var Logger = require('../../lib/Logger');

describe("Logger.removeAppender", function(){

	describe("that exists", function(){
		var parent = new Logger("null");
		parent.appenders = {};
		parent.appenders.error = [1,2,3];
		parent.appenders.warn  = [1,2,3];
		parent.appenders.info  = [1,2,3];
		parent.appenders.debug = [1,2,3];
		parent.appenders.trace = [1,2,3];
		var child = new Logger("paf", parent);

		parent.removeAppender("info", 2);

		describe("on logger", function (){
			it("remove for desired level", function(){
				assert.deepEqual([1,3], parent.appenders.info);
			});

			it("removes for lower levels", function(){
				assert.deepEqual([1,3], parent.appenders.debug);
				assert.deepEqual([1,3], parent.appenders.trace);
			});

			it("keeps for higher levels", function(){
				assert.deepEqual([1,2, 3], parent.appenders.error);
				assert.deepEqual([1,2, 3], parent.appenders.warn);
			});
		});
		
		describe("on children", function (){
			it("removes for desired level", function(){
				assert.deepEqual([1,3], child.appenders.info);
			});

			it("removes for lower levels", function(){
				assert.deepEqual([1,3], child.appenders.debug);
				assert.deepEqual([1,3], child.appenders.trace);
			});

			it("keeps for higher levels", function(){
				assert.deepEqual([1,2,3], child.appenders.warn);
				assert.deepEqual([1,2,3], child.appenders.error);
			});
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
});	
