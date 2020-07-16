require("core-js/stable");
const glob = require("glob");
const { createMacro } = require("babel-plugin-macros");
const path = require("path");
const yaml = require("yaml");
const pubPath = path.resolve(__dirname, "../public");
const gamedefs = path.resolve(__dirname, "../gamedefs");
const fs = require("fs-extra");
const { parseExpression } = require("@babel/parser");

function frenzyMacros({ babel, references, state }) {
  let { destroyers = [], destroyables = [], damagers = [] } = references;
  destroyables.forEach((refPath) => {
    destroyablePath = path.join(gamedefs, "destroyable");
    destroyableYmls = glob.sync(`${destroyablePath}/*.yml`);
    const entries = destroyableYmls.map((pth) =>
      yaml.parse(fs.readFileSync(pth).toString("utf-8"))
    );

    refPath.replaceWith(parseExpression(`() => (${JSON.stringify(entries)})`));
  });
}

module.exports = createMacro(frenzyMacros);
