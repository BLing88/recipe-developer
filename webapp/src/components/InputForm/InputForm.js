import React from "react";
import PropTypes from "prop-types";
import styles from "./InputForm.module.css";

const InputForm = ({
  title,
  objectName,
  displayName,
  displayType,
  objects,
  getValueOfObject,
  getIdOfObject,
  inputChangeHandler,
  addObjectHandler,
  deleteObjectHandler,
  cancelHandler,
}) => {
  return (
    <section className={styles.inputForm}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>{title}</h2>{" "}
        <button className={styles.cancelEditBtn} onClick={cancelHandler}>
          Cancel edit
        </button>
      </div>
      <ul className={styles.inputList}>
        {objects.map((object, i) => {
          return (
            <li className={styles.inputListItem} key={getIdOfObject(object)}>
              <label
                className={styles.inputLabel}
                htmlFor={`${objectName}-${i + 1}`}
              >
                {displayName} {i + 1}:
              </label>
              {displayType === "text" ? (
                <input
                  className={styles.input}
                  id={`${objectName}-${i + 1}`}
                  type="text"
                  value={getValueOfObject(object)}
                  onChange={e => inputChangeHandler(e, object, i)}
                />
              ) : (
                <textarea
                  className={styles.input}
                  id={`${objectName}-${i + 1}`}
                  type="text"
                  value={getValueOfObject(object)}
                  onChange={e => inputChangeHandler(e, object, i)}
                />
              )}

              <button
                className={styles.deleteInputBtn}
                onClick={() => deleteObjectHandler(i)}
                data-testid={`delete-${objectName}-${i + 1}`}
                aria-label={`delete ${objectName}`}
              >
                &times;
              </button>
            </li>
          );
        })}
      </ul>
      <button className={styles.addInputBtn} onClick={addObjectHandler}>
        Add {displayName}
      </button>
    </section>
  );
};
InputForm.propTypes = {
  title: PropTypes.string.isRequired,
  objectName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  displayType: PropTypes.oneOf(["text", "textarea"]).isRequired,
  objects: PropTypes.arrayOf(PropTypes.object).isRequired,
  getValueOfObject: PropTypes.func.isRequired,
  getIdOfObject: PropTypes.func.isRequired,
  inputChangeHandler: PropTypes.func.isRequired,
  addObjectHandler: PropTypes.func.isRequired,
  deleteObjectHandler: PropTypes.func.isRequired,
};

export { InputForm };
