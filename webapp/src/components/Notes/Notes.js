import React from "react";
import PropTypes from "prop-types";

import { idOfNote } from "../../utils/recipe";

const Notes = ({ notes }) => {
  return (
    <section className="notes-section">
      <h2>Notes</h2>
      <ul className="recipe-notes">
        {notes.map(note => (
          <li key={idOfNote(note)}>{note.note}</li>
        ))}
      </ul>
    </section>
  );
};
Notes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export { Notes };
