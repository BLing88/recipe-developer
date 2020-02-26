import faker from "faker";

export const buildArray = (length, fn) => {
  return Array.from({ length }, fn);
};

export const buildTestIngredients = overrides => {
  const { number } = overrides;
  const numberOfIngredients = number || faker.random.number(15);
  return buildArray(numberOfIngredients, () => ({
    ingredient: faker.commerce.productMaterial(),
    id: faker.random.uuid(),
  }));
};

export const buildTestNotes = overrides => {
  const { number } = overrides;
  const numberOfNotes = number || faker.random.number(15);
  return buildArray(numberOfNotes, () => ({
    note: faker.lorem.sentences(),
    id: faker.random.uuid(),
  }));
};

export const buildTestInstructions = overrides => {
  const { number } = overrides;
  const numberOfInstructions = number || faker.random.number(15);
  return buildArray(numberOfInstructions, () => ({
    instruction: faker.lorem.sentences(),
    id: faker.random.uuid(),
  }));
};

export const buildTestRecipe = (overrides = {}) => ({
  name: faker.productName(),
  id: faker.random.uuid(),
  ingredients: buildTestIngredients(),
  ...overrides,
});
