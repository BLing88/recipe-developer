import React, { useState } from "react";
import PropTypes from "prop-types";

const updateRecipeHandler = event => {
  event.preventDefault();
};

const EditRecipeForm = () => {
  const [name, setName] = useState("");

  return (
    <form onSubmit={event => updateRecipeHandler(event)}>
      <label htmlFor="update-title">Update title</label>
      <input
        id="update-title"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input type="submit" id="edit-recipe-submit" value="Submit" />
    </form>
  );
};

export { EditRecipeForm };
