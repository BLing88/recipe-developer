const { updateRecipe, deleteRecipe: dbDeleteRecipe } = require("./dynamodb");
const { getAuthorization } = require("./getAuthorization");
const { ForbiddenError } = require("apollo-server");

const createRecipe = async (_, { recipeInput }, context) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    return await updateRecipe(recipeInput);
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const updateRecipeName = async (
  _,
  { authorId, recipeId, newRecipeName },
  context
) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    const res = await updateRecipe({
      authorId,
      recipeId,
      recipeName: newRecipeName,
    });
    return res.recipeName;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const updateIngredients = async (
  _,
  { authorId, recipeId, ingredients },
  context
) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    const res = await updateRecipe({
      authorId,
      recipeId,
      ingredients,
    });
    return res.ingredients;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const updateInstructions = async (
  _,
  { authorId, recipeId, instructions },
  context
) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    const res = await updateRecipe({
      authorId,
      recipeId,
      instructions,
    });
    return res.instructions;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const updateNotes = async (_, { authorId, recipeId, notes }, context) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    const res = await updateRecipe({
      authorId,
      recipeId,
      notes,
    });
    return res.notes;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const deleteRecipe = async (_, { authorId, recipeId }, context) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    const res = await dbDeleteRecipe({
      authorId,
      recipeId,
    });
    return res.recipeId;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

module.exports = {
  createRecipe,
  deleteRecipe,
  updateRecipeName,
  updateIngredients,
  updateInstructions,
  updateNotes,
};
