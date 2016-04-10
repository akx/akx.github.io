var sprintf = require("sprintf-js").sprintf;

module.exports = function() {
	var output = "";
	var write = function write(/* ... */) {
		output += sprintf.apply(null, arguments);
	};
	write.getOutput = function getOutput() {
		return output;
	};
	return write;
};