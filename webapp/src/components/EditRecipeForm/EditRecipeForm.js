import React, { useState } from "react";
import PropTypes from "prop-types";

const EditRecipeForm = ({ updateRecipeHandler }) => {
  const [name, setName] = useState("");

  return (
    <form onSubmit={event => updateRecipeHandler(event)}>
      <label htmlFor="update-name">Update name</label>
      <input
        id="update-name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input type="submit" id="edit-recipe-submit" value="Submit" />
    </form>
  );
};
EditRecipeForm.propTypes = {
  updateRecipeHandler: PropTypes.func.isRequired
};

export { EditRecipeForm };
