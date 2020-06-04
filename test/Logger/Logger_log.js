var assert = require('assert');
var sinon = require('sinon');
var Logger = require('../../lib/Logger');

describe("Logger.log", function(){
	describe("call", function(){
		var debug = sinon.spy();
		var info = sinon.spy();
		var error = sinon.spy();
		var app = {};
		var log = new Logger("loggername", null, app);
		log.addAppender("info",info);
		log.addAppender("error",error);
		log.addAppender("debug",debug);
		log.info("msg",10);

		it("exact level", function(){
			assert.strictEqual(1, info.callCount);
		});

		it("lower level", function(){
			assert.strictEqual(1, debug.callCount);
		});

		it("never higher level", function(){
			assert.strictEqual(0, error.callCount);
		});

		it("first arg is app", function(){
			assert.strictEqual(app, info.getCall(0).args[0]);
		});

		it("second arg is loggerName", function(){
			assert.strictEqual("loggername", info.getCall(0).args[1]);
		});

		it("third arg is logLevel", function(){
			assert.strictEqual("info", info.getCall(0).args[2]);
		});

		it("others args are gived", function(){
			assert.strictEqual("msg", info.getCall(0).args[3]);
			assert.strictEqual(10, info.getCall(0).args[4]);
		});
	});

	it("don't call twice the same logger on different level", function(){
		var info = sinon.spy();
		var parent = new Logger("parent");
		parent.addAppender("info", info);
		var log = new Logger("test", parent);
		log.addAppender("info",info);
		log.info();

		assert.strictEqual(1, info.callCount);
	});

	it("emit error event if something wrong", function(){
		var info = 3 ;
		var logger = new Logger("parent");
		var errorHandler = sinon.spy();
		logger.addAppender("info", info);
		logger.once("error",errorHandler);
		logger.info();

		assert.strictEqual(1,errorHandler.callCount);
	});
});	
