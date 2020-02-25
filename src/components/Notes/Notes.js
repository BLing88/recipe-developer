import React from "react";
import PropTypes from "prop-types";

const Notes = ({ notes }) => {
  return (
    <div className="notes-section">
      <h2>Notes</h2>
      <ul className="recipe-notes">
        {notes.map(note => (
          <li key={note.id}>{note.note}</li>
        ))}
      </ul>
    </div>
  );
};
Notes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Notes };
