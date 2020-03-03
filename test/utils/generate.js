import faker from "faker";

export const buildArray = (length, fn) => {
  return Array.from({ length }, fn);
};

export const buildTestIngredients = (overrides = {}) => {
  const numberOfIngredients = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfIngredients, () => ({
    ingredient: faker.commerce.productMaterial(),
    ingredientId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestNotes = (overrides = {}) => {
  const numberOfNotes = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfNotes, () => ({
    note: faker.lorem.sentences(),
    noteId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestInstructions = (overrides = {}) => {
  const numberOfInstructions = overrides.number || 1 + faker.random.number(15);
  return buildArray(numberOfInstructions, () => ({
    instruction: faker.lorem.sentences(),
    instructionId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestRecipe = overrides => ({
  recipeName: faker.commerce.productName(),
  recipeId: faker.random.uuid(),
  author: faker.name.findName(),
  ingredients: buildTestIngredients(),
  instructions: buildTestInstructions(),
  notes: buildTestNotes(),
  ...overrides,
});

export const buildTestUser = (overrides = {}) => ({
  name: faker.name.findName(),
  nickname: faker.name.firstName(),
  ...overrides,
});
