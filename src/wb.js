const { sprintf } = require('sprintf-js');

module.exports = function () {
  let output = '';
  const write = function write(...args) {
    output += sprintf(...args);
  };
  write.getOutput = function getOutput() {
    return output;
  };
  return write;
};
