export default function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        var { node, file } = path;
        var re = new RegExp(file.opts.extra['inline-json-config-values'].matchPattern, 'g');

        if (t.isCallExpression(node.object) && t.isIdentifier(node.object.callee, { name: 'require' }) && t.isLiteral(node.object.arguments[0]) && node.object.arguments[0].value.match(re)) {
          let srcPath = path.resolve(this.state.opts.filename);
          let pkg = require(path.join(srcPath, '..', node.object.arguments[0].value));
          let value = pkg[node.property.name];

          return t.expressionStatement(t.valueToNode(value));
        }
      }
    }
  };
}