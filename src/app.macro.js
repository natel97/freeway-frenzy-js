require("core-js/stable");
const glob = require("glob");
const { createMacro } = require("babel-plugin-macros");
const path = require("path");
const yaml = require("yaml");
const pubPath = path.resolve(__dirname, "../public");
const gamedefs = path.resolve(__dirname, "../gamedefs");
const fs = require("fs-extra");
const { parseExpression } = require("@babel/parser");

function attachYmlsAsArray(inputRef, folderName) {
  inputRef.forEach((refPath) => {
    const fullPath = path.join(gamedefs, folderName);
    const ymls = glob.sync(`${fullPath}/*.yml`);
    const entries = ymls.map((pth) =>
      yaml.parse(fs.readFileSync(pth).toString("utf-8"))
    );

    refPath.replaceWith(parseExpression(`() => (${JSON.stringify(entries)})`));
  });
}

function frenzyMacros({ babel, references, state }) {
  let { destroyers = [], destroyables = [], damagers = [] } = references;
  attachYmlsAsArray(destroyers, "destroyer");
  attachYmlsAsArray(destroyables, "destroyable");
  attachYmlsAsArray(damagers, "damager");
}

module.exports = createMacro(frenzyMacros);
