var assert = require('assert');
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
				assert.deepEqual({"info" : [1,2,3]}, parent.appenders);
			});
			it("don't add on children", function(){
				assert.deepEqual({"info" : [1,2,3]}, child.appenders);
			});
		})

		describe("that do not already exist", function(){
			var parent = new Logger("null");
			parent.appenders = {"info" : [1,2]};
			var child = new Logger("paf", parent);

			parent.addAppender("info", 3);

			it("add on logger", function(){
				assert.deepEqual({"info" : [1,2,3]}, parent.appenders);
			});
			it("add on children", function(){
				assert.deepEqual({"info" : [1,2,3]}, child.appenders);
			});
		});
	});	
});
