/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// preprocessor.js
var fs = require('fs');
var path = require('path');
var typescript = require('typescript');
var react = require('react-tools');

var CACHE_DIR = path.join(path.resolve(__dirname + '/../build'));

function isFileNewer(a, b) {
  try {
    return fs.statSync(a).mtime > fs.statSync(b).mtime;
  } catch (ex) {
    return false;
  }
}

function compileTypeScript(filePath) {
  var options = {
    outDir: CACHE_DIR,
    noEmitOnError: true,
    target: typescript.ScriptTarget.ES5,
    module: typescript.ModuleKind.CommonJS
  };

  // re-use cached source if possible
  var outputPath = path.join(options.outDir, path.basename(filePath, '.ts')) + '.js';
  if (isFileNewer(outputPath, filePath)) {
    return fs.readFileSync(outputPath, {encoding: 'utf8'});
  }

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  var host = typescript.createCompilerHost(options);
  var program = typescript.createProgram([filePath], options, host);

  var diagnostics = program.getSyntacticDiagnostics();

  if (diagnostics.length === 0) {
    diagnostics = program.getGlobalDiagnostics();
  }

  if (diagnostics.length === 0) {
    diagnostics = program.getSemanticDiagnostics();
  }

  if (diagnostics.length === 0) {
    var emitOutput = program.emit();
    diagnostics = emitOutput.diagnostics;
  }

  if (diagnostics.length === 0) {
    return fs.readFileSync(outputPath, {encoding: 'utf8'});
  }

  diagnostics.forEach(function(diagnostic) {
    var loc = typescript.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    console.error('%s %d:%d %s', diagnostic.file.fileName, loc.line, loc.character, diagnostic.messageText);
  });
  throw new Error('Compiling ' + filePath + ' failed');
}

function withLocalImmutable(filePath, jsSrc) {
  return jsSrc.replace(
    /require\('immutable/g,
    "require('" + path.relative(path.dirname(filePath), process.cwd())
  );
}

module.exports = {
  process: function(src, filePath) {
    if (filePath.match(/\.ts$/) && !filePath.match(/\.d\.ts$/)) {
      return withLocalImmutable(filePath, compileTypeScript(filePath));
    }

    if (filePath.match(/\.js$/) && ~filePath.indexOf('/__tests__/')) {
      return withLocalImmutable(filePath, react.transform(src, {harmony: true}));
    }

    return src;
  }
};
