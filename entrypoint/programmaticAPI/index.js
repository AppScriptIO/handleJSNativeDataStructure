const projectConfig = require('../../configuration'),
  path = require('path'),
  filesystem = require('fs')

// • Run
if (filesystem.existsSync(projectConfig.directory.distribution)) {
  module.exports = require(projectConfig.directory.distribution)
} else {
  // • Transpilation (babelJSCompiler)
  const { Compiler } = require('@deployment/javascriptTranspilation')
  let compiler = new Compiler({ babelConfig: projectConfig.transpilation.babelConfig })
  compiler.requireHook()
  module.exports = require(path.join(projectConfig.directory.source, projectConfig.entrypoint.programmaticAPI))
}
