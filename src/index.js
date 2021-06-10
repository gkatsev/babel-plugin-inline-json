import nodePath from 'path';
import fs from 'fs';
import resolve from 'resolve';
import * as t from '@babel/types';

const isMatchedRequireCall = (node, state) => {
  let re = new RegExp(state.opts.matchPattern, 'g');

  return t.isIdentifier(node.callee, { name: 'require' }) &&
    t.isLiteral(node.arguments[0]) &&
    !t.isTemplateLiteral(node.arguments[0]) &&
    node.arguments[0].value.match(re);
};

const readJSON = (path, requireText) => {
  let srcPath = nodePath.resolve(path);
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

const readJSONNode = (node, state) => {
  let path = state.file.opts.filename;
  let requireText = node.arguments[0].value;

  return readJSON(path, requireText);
}

const replacePath = (path, value) => {
  path.replaceWith(t.expressionStatement(t.valueToNode(value)));
};

export default function () {
  return {
    visitor: {
      CallExpression(path, state) {
        let { node } = path;

        if (isMatchedRequireCall(node, state)) {
          const json = readJSONNode(node, state);

          if (json) {
            replacePath(path, json);
          }
        }
      },

      MemberExpression(path, state) {
        let { node } = path;

        if (isMatchedRequireCall(node.object, state)) {
          const json = readJSONNode(node.object, state);

          if (json) {
            replacePath(path, json[node.property.name]);
          }
        }
      },

      ImportDeclaration(path, state) {
        let { node } = path;

        const jsonPath = node.source.value
        const json = readJSON(state.file.opts.filename, jsonPath);

        if (json) {
          const variables = node.specifiers.map((specifier) => {
            const name = specifier.imported.name;

            return t.variableDeclarator(t.identifier(name), t.valueToNode(json[name]));
          });

          path.replaceWith(t.variableDeclaration('const', variables));

        }
      }
    }
  };
}
