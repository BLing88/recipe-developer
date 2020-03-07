const { getAllRecipesById, getRecipeById } = require("./dynamodb");
const { getAuthorization } = require("./getAuthorization");
const { ForbiddenError } = require("apollo-server");

const getAllRecipes = async (_, { authorId }, context) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    return await getAllRecipesById({ authorId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const getRecipe = async (_, { authorId, recipeId }, context) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    return await getRecipeById({ authorId, recipeId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

module.exports = {
  getAllRecipes,
  getRecipe,
};
