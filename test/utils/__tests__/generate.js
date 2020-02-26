import { buildArray, buildTestIngredients } from "../generate";

describe("buildArray ", () => {
  test("constructs array of squared numbers", () => {
    const squares = buildArray(10, (_, index) => index * index);
    expect(squares).toHaveLength(10);
    expect(squares).toEqual([0, 1, 4, 9, 16, 25, 36, 49, 64, 81]);
  });

  test("constructs array of objects with index as property", () => {
    const objects = buildArray(15, (_, i) => ({
      i,
    }));

    objects.forEach(object => expect(object).toHaveProperty("i"));
  });
});

describe("buildTestIngredients", () => {
  test("constructs array of ingredient objects", () => {
    const ingredients = buildTestIngredients({ number: 10 });
    expect(ingredients).toHaveLength(10);
    ingredients.forEach(ingredient => {
      expect(ingredient).toHaveProperty("ingredient");
      expect(ingredient).toHaveProperty("id");
    });
  });
});
