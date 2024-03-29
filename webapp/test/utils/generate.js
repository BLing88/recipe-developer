import faker from "faker";

export const buildArray = (length, fn) => {
  return Array.from({ length }, fn);
};

export const buildTestIngredients = (overrides = {}) => {
  const numberOfIngredients = overrides.number || 2 + faker.random.number(15);
  return buildArray(numberOfIngredients, () => ({
    ingredient: faker.commerce.productMaterial(),
    ingredientId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestNotes = (overrides = {}) => {
  const numberOfNotes = overrides.number || 2 + faker.random.number(15);
  return buildArray(numberOfNotes, () => ({
    note: faker.lorem.sentences(),
    noteId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestInstructions = (overrides = {}) => {
  const numberOfInstructions = overrides.number || 2 + faker.random.number(15);
  return buildArray(numberOfInstructions, () => ({
    instruction: faker.lorem.sentences(),
    instructionId: faker.random.uuid(),
    ...overrides,
  }));
};

export const buildTestRecipe = overrides => ({
  recipeName: faker.commerce.productName(),
  recipeId: faker.random.uuid(),
  authorId: faker.name.findName(),
  ingredients: buildTestIngredients(),
  instructions: buildTestInstructions(),
  notes: buildTestNotes(),
  ...overrides,
});

export const buildTestUser = (overrides = {}) => {
  const userId = overrides.userId || faker.random.uuid();
  const numberOfRecipes =
    overrides.numberOfRecipes || 1 + faker.random.number(15);
  return {
    sub: userId,
    username: faker.name.findName(),
    recipes: buildArray(numberOfRecipes, () =>
      buildTestRecipe({
        authorId: userId,
      })
    ),
    ...overrides,
  };
};
