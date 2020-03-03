const faker = require("faker");

const buildArray = (length, fn) => {
  return Array.from({ length }, fn);
};

const buildTestIngredients = (overrides = {}) => {
  const numberOfIngredients = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfIngredients, () => ({
    ingredient: faker.commerce.productMaterial(),
    ingredientId: faker.random.uuid(),
    ...overrides,
  }));
};

const buildTestNotes = (overrides = {}) => {
  const numberOfNotes = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfNotes, () => ({
    note: faker.lorem.sentences(),
    noteId: faker.random.uuid(),
    ...overrides,
  }));
};

const buildTestInstructions = (overrides = {}) => {
  const numberOfInstructions = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfInstructions, () => ({
    instruction: faker.lorem.sentences(),
    instructionId: faker.random.uuid(),
    ...overrides,
  }));
};

const buildTestRecipe = overrides => ({
  recipeName: faker.commerce.productName(),
  recipeId: faker.random.uuid(),
  authorId: faker.name.findName(),
  ingredients: buildTestIngredients(),
  instructions: buildTestInstructions(),
  notes: buildTestNotes(),
  ...overrides,
});

const buildTestUser = (overrides = {}) => ({
  name: faker.name.findName(),
  nickname: faker.name.firstName(),
  ...overrides,
});

module.exports = {
  buildArray,
  buildTestIngredients,
  buildTestInstructions,
  buildTestNotes,
  buildTestRecipe,
  buildTestUser,
};
