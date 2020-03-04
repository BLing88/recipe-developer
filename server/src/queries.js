const { getAllRecipesById, getRecipe } = require("./dynamodb");

const getAllRecipes = async (_, { authorId }) => {
  return await getAllRecipesById(authorId);
};

const recipe = async (_, { recipeId }) => {
  return await getRecipe(recipeId);
};

module.exports = {
  getAllRecipes,
  recipe,
};
