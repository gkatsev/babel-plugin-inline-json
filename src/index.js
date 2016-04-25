import path from 'path';

export default function({ Plugin, types: t }) {
  return new Plugin('inline-json-config-values', {
    visitor: {
      MemberExpression: function MemberExpression(node, parent, scope, file) {
        var re = new RegExp(file.opts.extra['inline-json-config-values'].matchPattern, 'g');
        if (t.isCallExpression(node.object) &&
            t.isIdentifier(node.object.callee, { name: 'require' }) &&
            t.isLiteral(node.object.arguments[0]) &&
            node.object.arguments[0].value.match(re)) {
          let srcPath = path.resolve(this.state.opts.filename);
          let pkg = require(path.join(srcPath, '..', node.object.arguments[0].value));
          let value = pkg[node.property.name];

          return t.expressionStatement(t.valueToNode(value));
        }
      }
    }
  });
}
