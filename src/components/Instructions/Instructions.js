import React from "react";
import PropTypes from "prop-types";

import { idOfInstruction } from "utils/recipe";

const Instructions = ({ instructions }) => (
  <section className="instructions">
    <h2>Instructions</h2>
    <ol className="recipe-instructions">
      {instructions.map(instruction => (
        <li key={idOfInstruction(instruction)}>{instruction.instruction}</li>
      ))}
    </ol>
  </section>
);
Instructions.propTypes = {
  instructions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Instructions };
