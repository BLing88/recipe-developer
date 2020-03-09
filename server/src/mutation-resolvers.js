const {
  updateRecipe: dbUpdateRecipe,
  deleteRecipe: dbDeleteRecipe,
} = require("./dynamodb");
const { getAuthorization } = require("./getAuthorization");
const { ForbiddenError } = require("apollo-server");

const createRecipe = async (_, { recipeInput, authorId }, context) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    return await dbUpdateRecipe({ ...recipeInput, authorId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

const updateRecipe = async (
  _,
  { authorId, recipeId, recipeName, ingredients, instructions, notes },
  context
) => {
  const { isAuthorized, error } = await getAuthorization(context);
  if (isAuthorized) {
    return await dbUpdateRecipe({
      authorId,
      recipeId,
      recipeName,
      ingredients,
      instructions,
      notes,
    });
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
    const res = await dbUpdateRecipe({
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
    const res = await dbUpdateRecipe({
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
    const res = await dbUpdateRecipe({
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
    const res = await dbUpdateRecipe({
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
  updateRecipe,
  updateRecipeName,
  updateIngredients,
  updateInstructions,
  updateNotes,
};
