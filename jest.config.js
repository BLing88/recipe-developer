module.exports = {
  testEnvironment: "jest-environment-node",
  setupFilesAfterEnv: ["./test/setup-env"],
  moduleDirectories: ["node_modules", "test/utils", "recipe"],
};
