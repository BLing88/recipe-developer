const { getAllRecipesById, getRecipe } = require("./dynamodb");

const getAllRecipes = async (_, { authorId }) => {
  return await getAllRecipesById({ authorId });
};

const getRecipe = async (_, { authorId, recipeId }) => {
  return await getRecipe({ authorId, recipeId });
};

module.exports = {
  getAllRecipes,
  getRecipe,
};
