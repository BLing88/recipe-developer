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
  const randomInt = number || faker.random.number(number);
  let notes = [];
  for (let i = 0; i < randomInt; i++) {
    notes.push({
      note: faker.lorem.sentences(),
      id: faker.random.uuid(),
    });
  }
  return notes;
};

export const buildTestInstructions = overrides => {
  const { number } = overrides;
  const randomInt = faker.random.number(number);
  let instructions = [];
  for (let i = 0; i < randomInt; i++) {
    instructions.push({
      instruction: faker.lorem.sentences(),
      id: faker.random.uuid(),
    });
  }
  return instructions;
};

export const buildTestRecipe = (overrides = {}) => ({
  name: faker.productName(),
  id: faker.random.uuid(),
  ingredients: buildTestIngredients(),
  ...overrides,
});
