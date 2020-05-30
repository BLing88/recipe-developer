/// <reference types="react-scripts" />

namespace Recipes {
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

  interface Recipe {
    recipeName: string;
    authorId: string;
    recipeId: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    notes: Note[];
  }

  interface RecipeSummary {
    recipeName: string;
    recipeId: string;
  }

  type Component = Ingredient | Instruction | Note;
  type ComponentArray = Ingredient[] | Instruction[] | Note[];
}

namespace InputForm {
  interface RecipeComponentProjection<T> {
    (x: T): string;
  }

  interface InputChangeHandler<T> {
    (
      e:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>,
      x: T,
      i: number
    ): void;
  }

  interface InputFormProps<T> {
    title: string;
    objectName: string;
    displayName: string;
    displayType: "text" | "textarea";
    objects: T[];
    getValueOfObject: RecipeComponentProjection<T>;
    getIdOfObject: RecipeComponentProjection<T>;
    inputChangeHandler: InputChangeHandler<T>;
    addObjectHandler: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    deleteObjectHandler: (i: number) => void;
    showCancelBtn: boolean;
    cancelHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }
}
