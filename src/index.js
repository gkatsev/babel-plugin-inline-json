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
  let json;
  if (fs.existsSync(jsonPath + '.json')) {
    json = require(jsonPath);
  } else {
    json = require(resolve.sync(requireText, {
      basedir: nodePath.dirname(srcPath)
    }));
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
          replacePath(path, readJSON(node, state))
        }
      },

      MemberExpression(path, state) {
        let { node } = path;

        if (isMatchedRequireCall(node.object, state)) {
          replacePath(path, readJSON(node.object, state)[node.property.name]);
        }
      }
    }
  };
}
