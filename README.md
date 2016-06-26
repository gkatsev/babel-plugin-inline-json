# babel-plugin-inline-json-config-values

Inline values from a JSON file eg. a config file

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
$ npm install babel-plugin-inline-json-config-values --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [["inline-json-config-values", {"matchPattern": "config"}]]
}
```

### Via CLI

```sh
$ babel --plugins inline-json-config-values script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  "plugins": [["inline-json-config-values", {"matchPattern": "config"}]]
});
```
