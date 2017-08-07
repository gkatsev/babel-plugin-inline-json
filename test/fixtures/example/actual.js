var config = require('config');
var foo = require('config').foo;
var name = require('../../../package.json').name;

console.log(config);
console.log(foo);
console.log(name);
