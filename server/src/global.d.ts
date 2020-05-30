interface Ingredient {
  ingredient: string;
  ingredientId: string;
}

interface Instruction {
  instruction: string;
  instructionId: string;
}

interface Note {
  note: string;
  noteId: string;
}

interface ServerContext {
  event: APIGatewayProxyEvent;
  accessToken: string;
}

interface Recipe {
  recipeId: string;
  authorId: string;
  recipeName: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  notes: Note[];
}
