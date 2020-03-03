module.exports = {
  testEnvironment: "jest-environment-node",
  setupFilesAfterEnv: [require.resolve("./test/setup-env")],
};
