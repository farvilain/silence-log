var assert = require('assert');
var sinon = require('sinon');
var Logger = require('../lib/Logger');

describe("Logger", function(){
	describe("constructor", function(){
		it("works", function(){
			var l = new Logger("paf");
			assert.ok(l);
		});
		it("set the name", function(){
			var l = new Logger("paf");
			assert.strictEqual("paf", l.name);
		});
		it("has no parent", function(){
			var l = new Logger("paf");
			assert.strictEqual(null, l.parent);
		});
		it("has empty children", function(){
			var l = new Logger("paf");
			assert.deepEqual([], l.children);
		});
		it("has no appenders", function(){
			var l = new Logger("paf");
			assert.deepEqual({}, l.appenders);
		});
	});

	describe("constructor with parent", function(){
		var parent = new Logger("null");
		parent.appenders = {
			"ha" : [1,2],
			"b"  : [2,4]
		};
		var l = new Logger("paf", parent);

		it("works", function(){
			assert.ok(l);
		});
		it("set the name", function(){
			assert.strictEqual("paf", l.name);
		});
		it("has the good parent", function(){
			assert.strictEqual(parent, l.parent);
		});
		it("has empty children", function(){
			assert.deepEqual([], l.children);
		});
		it("add child into parent", function(){
			assert.strictEqual(1, parent.children.length);
			assert.strictEqual(l, parent.children[0]);
		});
		it("propagates the parent appenders", function(){
			assert.deepEqual({"ha":[1,2], "b":[2,4]}, l.appenders);
		});
	});

	describe("addAppender", function(){

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

	describe("log", function(){

		describe("call", function(){
			var debug = { log : sinon.spy() };
			var info = { log : sinon.spy() };
			var error = { log : sinon.spy() };
			var log = new Logger("loggername");
			log.addAppender("info",info);
			log.addAppender("error",error);
			log.addAppender("debug",debug);
			log.info("msg",10);

			it("exact level", function(){
				assert.strictEqual(1, info.log.callCount);
			});

			it("lower level", function(){
				assert.strictEqual(1, debug.log.callCount);
			});

			it("never higher level", function(){
				assert.strictEqual(0, error.log.callCount);
			});

			it("first arg is loggerName", function(){
				assert.strictEqual("loggername", info.log.getCall(0).args[0]);
			});

			it("second arg is logLevel", function(){
				assert.strictEqual("info", info.log.getCall(0).args[1]);
			});

			it("others args are gived", function(){
				assert.strictEqual("msg", info.log.getCall(0).args[2]);
				assert.strictEqual(10, info.log.getCall(0).args[3]);
			});
		});

		it("don't call twice the same logger on different level", function(){
			var info = { log : sinon.spy() };
			var parent = new Logger("parent");
			parent.addAppender("info", info);
			var log = new Logger("test", parent);
			log.addAppender("info",info);
			log.info();

			assert.strictEqual(1, info.log.callCount);
		});

		it("emit error event if something wrong", function(){
			var info = { log : 3 };
			var logger = new Logger("parent");
			var errorHandler = sinon.spy();
			logger.addAppender("info", info);
			logger.once("error",errorHandler);
			logger.info();

			assert.strictEqual(1,errorHandler.callCount);
		});
	});	
});
