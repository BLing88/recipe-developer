interface RecipeListItem {
  lastModifiedOn: string;
  recipeName: string;
  createdOn: string;
}

export const sortRecipesByLastModified = (
  recipe1: RecipeListItem,
  recipe2: RecipeListItem
) => {
  return recipe1.lastModifiedOn > recipe2.lastModifiedOn ? -1 : 1;
};

export const sortRecipeByName = (
  recipe1: RecipeListItem,
  recipe2: RecipeListItem
) => {
  return recipe1.recipeName.toLocaleLowerCase() <=
    recipe2.recipeName.toLocaleLowerCase()
    ? -1
    : 1;
};

export const sortByCreatedOn = (
  recipe1: RecipeListItem,
  recipe2: RecipeListItem
) => {
  return recipe1.createdOn < recipe2.createdOn ? -1 : 1;
};
