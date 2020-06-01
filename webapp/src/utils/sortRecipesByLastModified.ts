interface RecipeListItem {
  lastModifiedOn: string;
}

export const sortRecipesByLastModified = (
  recipe1: RecipeListItem,
  recipe2: RecipeListItem
) => {
  return recipe1.lastModifiedOn > recipe2.lastModifiedOn ? -1 : 1;
};
