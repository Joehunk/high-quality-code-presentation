// You have to tell Jest what 3rd party modules to transpile. Normally it
// ignores everything in node_modules
//
// Add an array of npm 3rd party module names you want to transpile
// for testing here.
const modulesToTranspileForTesting = [];

function getTransformIgnorePatterns() {
  if (modulesToTranspileForTesting && modulesToTranspileForTesting.length > 0) {
    return [`/node_modules/(?!${modulesToTranspileForTesting.join("|")})`];
  } else {
    return ["/node_modules/"];
  }
}

module.exports = {
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: getTransformIgnorePatterns(),
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  testRegex: "(/__tests__/.+\\.(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
};
