import React from "react";
import PropTypes from "prop-types";

const Notes = ({ notes }) => {
  return (
    <div className="recipe-notes">
      <h2>Notes</h2>
      {notes.map((note, i) => (
        <li key={i}>{note}</li>
      ))}
    </div>
  );
};
Notes.propTypes = {
  notes: PropTypes.array.isRequired
};

export { Notes };
