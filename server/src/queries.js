const { getAllRecipesById, getRecipeById } = require("./dynamodb");

const getAllRecipes = async (_, { authorId }, context) => {
  return await getAllRecipesById({ authorId });
};

const getRecipe = async (_, { authorId, recipeId, context }) => {
  return await getRecipeById({ authorId, recipeId });
};

module.exports = {
  getAllRecipes,
  getRecipe,
};
