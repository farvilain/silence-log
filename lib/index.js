if( ! global.loggerFactory){
	global.loggerFactory = require('./factory');
}

module.exports = global.loggerFactory;
