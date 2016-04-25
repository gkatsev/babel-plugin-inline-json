# babel-plugin-inline-json-config-values



## Installation

```sh
$ npm install babel-plugin-inline-json-config-values
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["inline-json-config-values"],
  "extra": {
    "inline-json-config-values": {
      "matchPattern": "server-config"
    }
  }
}
```

### Via CLI

```sh
$ babel --plugins inline-json-config-values script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  "plugins": ["inline-json-config-values"],
  "extra": {
    "inline-json-config-values": {
      "matchPattern": "server-config"
    }
  }
});
```
