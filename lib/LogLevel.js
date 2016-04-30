var allLevels = ["trace","debug","info","warn","error"];

function LogLevel(){

}

allLevels.forEach(function(level, index){
	LogLevel[level] = {
		name : level,
		gt   : allLevels.slice(index+1), 
		gte : allLevels.slice(index),
		lt : allLevels.slice(0, index),
		lte : allLevels.slice(0, index+1)
	};
});

module.exports = LogLevel;