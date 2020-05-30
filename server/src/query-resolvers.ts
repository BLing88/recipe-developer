import { getAllRecipesById, getRecipeById } from "./dynamodb";
import { getAuthorization } from "./getAuthorization";
import { ForbiddenError } from "apollo-server";

export const getAllRecipes = async (
  _: any,
  { authorId }: { authorId: string },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    return await getAllRecipesById({ authorId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const getRecipe = async (
  _: any,
  { authorId, recipeId }: { authorId: string; recipeId: string },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    return await getRecipeById({ authorId, recipeId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};
