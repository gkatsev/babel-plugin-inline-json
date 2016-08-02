import nodePath from 'path';
import fs from 'fs';
import resolve from 'resolve';

export default function ({types: t}) {
  return {
    visitor: {
      MemberExpression(path, state) {
        let {node, file} = path;
        let re = new RegExp(state.opts.matchPattern, 'g');

        if (t.isCallExpression(node.object) &&
            t.isIdentifier(node.object.callee, { name: 'require' }) &&
            t.isLiteral(node.object.arguments[0]) &&
            node.object.arguments[0].value.match(re)) {
          let srcPath = nodePath.resolve(state.file.opts.filename);
          let requireText = node.object.arguments[0].value;


          let jsonPath = nodePath.join(srcPath, '..', requireText);
          let pkg;
          if (fs.existsSync(jsonPath + '.json')) {
            pkg = require(jsonPath);
          } else {
            pkg = require(resolve.sync(requireText, {
              basedir: nodePath.dirname(srcPath)
            }));
          }

          let value = pkg[node.property.name];
          path.replaceWith(t.expressionStatement(t.valueToNode(value)));
        }
      }
    }
  };
}
