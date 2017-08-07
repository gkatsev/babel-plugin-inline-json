# babel-plugin-inline-json
[![Build Status](https://travis-ci.org/gkatsev/babel-plugin-inline-json.svg?branch=master)](https://travis-ci.org/gkatsev/babel-plugin-inline-json)

Inline values from a JSON file eg. a config file

> Does not work if the argument to `require()` is an identifier or a template literal

## Example

**config.json**:

```json
{
  "foo": "bar"
}
```

**In**

```js
var foo = require('config').foo;
```

**Out**

```js
var foo = "bar";
```

## Installation

```sh
$ npm install babel-plugin-inline-json --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [["inline-json", {"matchPattern": "config"}]]
}
```

### Via CLI

```sh
$ babel --plugins inline-json script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  "plugins": [["inline-json", {"matchPattern": "config"}]]
});
```

## Origin
this is based on @mwilliams-change's [babel-plugin-inline-json-config-values](https://github.com/mwilliams-change/babel-plugin-inline-json-config-values).
