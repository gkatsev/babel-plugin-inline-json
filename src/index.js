import nodePath from 'path';
import fs from 'fs';
import resolve from 'resolve';
import * as t from 'babel-types';

const isMatchedRequireCall = (node, state) => {
  let re = new RegExp(state.opts.matchPattern, 'g');

  return t.isIdentifier(node.callee, { name: 'require' }) &&
    t.isLiteral(node.arguments[0]) &&
    !t.isTemplateLiteral(node.arguments[0]) &&
    node.arguments[0].value.match(re);
};

const readJSON = (node, state) => {
  let srcPath = nodePath.resolve(state.file.opts.filename);
  let requireText = node.arguments[0].value;

  let jsonPath = nodePath.join(srcPath, '..', requireText);
  let json = null;

  if (fs.existsSync(jsonPath + '.json')) {
    json = require(jsonPath);
  } else {
    const file = resolve.sync(requireText, {
      basedir: nodePath.dirname(srcPath)
    });

    if (fs.existsSync(file)) {
      const fileText = fs.readFileSync(file, 'utf8');

      try {
        json = JSON.parse(fileText);
      } catch (e) {
        // if unable to JSON.parse, not a JSON file, so, ignore and move on
      }
    }
  }

  return json;
};

const replacePath = (path, value) => {
  path.replaceWith(t.expressionStatement(t.valueToNode(value)));
};

export default function () {
  return {
    visitor: {
      CallExpression(path, state) {
        let { node } = path;

        if (isMatchedRequireCall(node, state)) {
          const json = readJSON(node, state);

          if (json) {
            replacePath(path, json);
          }
        }
      },

      MemberExpression(path, state) {
        let { node } = path;

        if (isMatchedRequireCall(node.object, state)) {
          const json = readJSON(node.object, state);

          if (json) {
            replacePath(path, json[node.property.name]);
          }
        }
      }
    }
  };
}
