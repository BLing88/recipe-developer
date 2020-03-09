import React from "react";
import PropTypes from "prop-types";

import { idOfInstruction, getInstructionOf } from "../../utils/recipe";

const Instructions = ({ instructions, onClick }) => (
  <section className="instructions">
    <h2>Instructions</h2>
    <ol className="recipe-instructions">
      {instructions.map(instruction => (
        <li onClick={onClick} key={idOfInstruction(instruction)}>
          {getInstructionOf(instruction)}
        </li>
      ))}
    </ol>
  </section>
);
Instructions.propTypes = {
  instructions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired,
};

export { Instructions };
