import nodePath from 'path';

export default function ({types: t}) {
  return {
    visitor: {
      MemberExpression(path, state) {
        var {node, file} = path;
        var re = new RegExp(state.opts.matchPattern || '.json$', 'g');

        if (t.isCallExpression(node.object) &&
            t.isIdentifier(node.object.callee, { name: 'require' }) &&
            t.isLiteral(node.object.arguments[0]) &&
            node.object.arguments[0].value.match(re)) {
          let srcPath = nodePath.resolve(state.file.opts.filename);
          let pkg = require(nodePath.join(srcPath, '..', node.object.arguments[0].value));
          let value = pkg[node.property.name];

          path.replaceWith(t.expressionStatement(t.valueToNode(value)));
        }
      }
    }
  };
}
