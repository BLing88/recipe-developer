const { getAllRecipes, getRecipe } = require("./dynamodb");

const allRecipes = async ({ authorId }) => {
  return await getAllRecipes(authorId);
};

const getRecipe = async ({ recipeId }) => {
  return await getRecipe(recipeId);
};
