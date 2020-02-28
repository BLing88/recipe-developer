const { getAllRecipes, getRecipe } = require("./dynamodb");

const allRecipes = async (_, { authorId }) => {
  return await getAllRecipes(authorId);
};

const recipe = async (_, { recipeId }) => {
  return await getRecipe(recipeId);
};

module.exports = {
  allRecipes,
  recipe,
};
