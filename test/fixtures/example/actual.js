var config = require('config');
var foo = require('config').foo;
var name = require('../../../package.json').name;

var foo = require('babel-register');

console.log(config);
console.log(foo);
console.log(name);
