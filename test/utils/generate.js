import faker from "faker";
// import { v4 as randomId } from "uuid";

export const buildTestIngredients = () => {
  const randomInt = faker.random.number(15);
  let ingredients = [];
  for (let i = 0; i < randomInt; i++) {
    ingredients.push({
      ingredient: faker.commerce.productMaterial(),
      id: faker.random.uuid(),
    });
  }
  return ingredients;
};

export const buildTestRecipe = (overrides = {}) => ({
  name: faker.productName(),
  id: faker.random.uuid(),
  ingredients: buildTestIngredients(),
  ...overrides,
});
