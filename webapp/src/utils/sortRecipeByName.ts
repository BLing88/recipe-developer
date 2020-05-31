interface RecipeListItem {
  recipeName: string;
  recipeId: string;
}

export const sortRecipeByName = (
  recipe1: RecipeListItem,
  recipe2: RecipeListItem
) => {
  return recipe1.recipeName.toLocaleLowerCase() <=
    recipe2.recipeName.toLocaleLowerCase()
    ? -1
    : 1;
};
