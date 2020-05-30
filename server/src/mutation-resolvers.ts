import {
  updateRecipe as dbUpdateRecipe,
  deleteRecipe as dbDeleteRecipe,
} from "./dynamodb";
import { getAuthorization } from "./getAuthorization";
import { ForbiddenError } from "apollo-server";

interface UpdateRecipeResponse
  extends AWS.DynamoDB.DocumentClient.UpdateItemOutput {
  recipeId?: string;
  recipeName?: string;
  ingredients?: Ingredient[];
  instructions?: Instruction[];
  notes?: Note[];
}

interface DeleteRecipeResponse
  extends AWS.DynamoDB.DocumentClient.DeleteItemOutput {
  authorId?: string;
  recipeId?: string;
}

export const createRecipe = async (
  _: any,
  { recipeInput, authorId }: { authorId: string; recipeInput: Recipe },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    return await dbUpdateRecipe({ ...recipeInput, authorId });
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const updateRecipe = async (
  _: any,
  { authorId, recipeId, recipeName, ingredients, instructions, notes }: Recipe,
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
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

export const updateRecipeName = async (
  _: any,
  {
    authorId,
    recipeId,
    newRecipeName,
  }: { authorId: string; recipeId: string; newRecipeName: string },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    const res: UpdateRecipeResponse = await dbUpdateRecipe({
      authorId,
      recipeId,
      recipeName: newRecipeName,
    });
    return res.recipeName;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const updateIngredients = async (
  _: any,
  {
    authorId,
    recipeId,
    ingredients,
  }: { authorId: string; recipeId: string; ingredients: Ingredient[] },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    const res: UpdateRecipeResponse = await dbUpdateRecipe({
      authorId,
      recipeId,
      ingredients,
    });
    return res.ingredients;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const updateInstructions = async (
  _: any,
  {
    authorId,
    recipeId,
    instructions,
  }: { authorId: string; recipeId: string; instructions: Instruction[] },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    const res: UpdateRecipeResponse = await dbUpdateRecipe({
      authorId,
      recipeId,
      instructions,
    });
    return res.instructions;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const updateNotes = async (
  _: any,
  {
    authorId,
    recipeId,
    notes,
  }: { authorId: string; recipeId: string; notes: Note[] },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    const res: UpdateRecipeResponse = await dbUpdateRecipe({
      authorId,
      recipeId,
      notes,
    });
    return res.notes;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};

export const deleteRecipe = async (
  _: any,
  { authorId, recipeId }: { authorId: string; recipeId: string },
  context: ServerContext
) => {
  const { isAuthorized } = await getAuthorization(context);
  if (isAuthorized) {
    const res: DeleteRecipeResponse = await dbDeleteRecipe({
      authorId,
      recipeId,
    });
    return res.recipeId;
  } else {
    throw new ForbiddenError(`You are not authorized`);
  }
};
