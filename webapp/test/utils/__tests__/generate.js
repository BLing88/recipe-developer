import {
  buildArray,
  buildTestIngredients,
  buildTestNotes,
  buildTestRecipe,
} from "../generate";

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

describe("buildTestNotes", () => {
  test("constructs array of note objects", () => {
    const notes = buildTestNotes({ number: 14 });
    expect(notes).toHaveLength(14);
    notes.forEach(note => {
      expect(note).toHaveProperty("note");
      expect(note).toHaveProperty("id");
    });
  });
});

describe("buildTestRecipe", () => {
  test("constructs a recipe object", () => {
    const recipe = buildTestRecipe();
    expect(recipe).toHaveProperty("name");
    expect(recipe).toHaveProperty("id");
    expect(recipe).toHaveProperty("author");
    expect(recipe).toHaveProperty("ingredients");
    expect(recipe).toHaveProperty("instructions");
    expect(recipe).toHaveProperty("notes");
  });
});
