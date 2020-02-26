// for running tests outside of src/ directory since CRA test script only
// looks inside /src
module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }]],
};
