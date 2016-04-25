'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

exports['default'] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin('inline-json-config-values', {
    visitor: {
      MemberExpression: function MemberExpression(node, parent, scope, file) {
        var re = new RegExp(file.opts.extra['inline-json-config-values'].matchPattern, 'g');
        if (t.isCallExpression(node.object) && t.isIdentifier(node.object.callee, { name: 'require' }) && t.isLiteral(node.object.arguments[0]) && node.object.arguments[0].value.match(re)) {
          var srcPath = _path2['default'].resolve(this.state.opts.filename);
          var pkg = require(_path2['default'].join(srcPath, '..', node.object.arguments[0].value));
          var value = pkg[node.property.name];

          return t.expressionStatement(t.valueToNode(value));
        }
      }
    }
  });
};

module.exports = exports['default'];