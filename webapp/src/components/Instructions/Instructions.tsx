import React from "react";

import { idOfInstruction, getInstructionOf } from "../../utils/recipe";

const Instructions = ({
  instructions,
  onClick,
}: {
  instructions: Recipes.Instruction[];
  onClick: () => void;
}) => (
  <section className="instructions">
    <h2 onClick={onClick}>Instructions</h2>
    <ol className="recipe-instructions">
      {instructions.map((instruction) => (
        <li onClick={onClick} key={idOfInstruction(instruction)}>
          {getInstructionOf(instruction)}
        </li>
      ))}
    </ol>
  </section>
);

export { Instructions };
