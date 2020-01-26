import React from "react";
import PropTypes from "prop-types";

const Notes = ({ notes }) => {
  return (
    <div className="notes-section">
      <h2>Notes</h2>
      <ul className="recipe-notes">
        {notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
};
Notes.propTypes = {
  notes: PropTypes.array.isRequired
};

export { Notes };
