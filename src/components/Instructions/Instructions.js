import React from "react";
import PropTypes from "prop-types";

const Instructions = ({ instructions }) => (
  <div className="instructions">
    <h2>Instructions</h2>
    <ol className="recipe-instructions">
      {instructions.map(instruction => (
        <li key={instruction.id}>{instruction.instruction}</li>
      ))}
    </ol>
  </div>
);
Instructions.propTypes = {
  instructions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Instructions };
