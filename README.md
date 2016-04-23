# babel-plugin-inline-json-values



## Installation

```sh
$ npm install babel-plugin-inline-json-values
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["inline-json-values"]
}
```

### Via CLI

```sh
$ babel --plugins inline-json-values script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["inline-json-values"]
});
```
