var assert = require('assert');
var sinon = require('sinon');
var Logger = require('../../lib/Logger');

describe("Logger.new", function(){
	describe("without parent", function(){
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

	describe("with parent", function(){
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
});
