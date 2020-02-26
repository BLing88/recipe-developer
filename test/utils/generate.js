import faker from "faker";

export const buildArray = (length, fn) => {
  return Array.from({ length }, fn);
};

export const buildTestIngredients = (overrides = {}) => {
  const numberOfIngredients = overrides.number || faker.random.number(15);
  return buildArray(numberOfIngredients, () => ({
    ingredient: faker.commerce.productMaterial(),
    id: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestNotes = (overrides = {}) => {
  const numberOfNotes = overrides.number || faker.random.number(15);
  return buildArray(numberOfNotes, () => ({
    note: faker.lorem.sentences(),
    id: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestInstructions = (overrides = {}) => {
  const numberOfInstructions = overrides.number || faker.random.number(15);
  return buildArray(numberOfInstructions, () => ({
    instruction: faker.lorem.sentences(),
    id: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestRecipe = overrides => ({
  name: faker.commerce.productName(),
  id: faker.random.uuid(),
  ingredients: buildTestIngredients(),
  instructions: buildTestInstructions(),
  notes: buildTestNotes(),
  ...overrides,
});
