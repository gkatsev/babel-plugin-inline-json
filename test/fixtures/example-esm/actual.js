import * as config from 'config';
import { foo } from 'config';
import { name } from '../../../package.json';

var babel = require('@babel/register');

console.log(config);
console.log(foo);
console.log(name);
