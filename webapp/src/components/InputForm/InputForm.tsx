import React from "react";
import styles from "./InputForm.module.css";

interface InputFormProps {
  title: string;
  objectName: string;
  displayName: string;
  displayType: "text" | "textarea";
  objects: Recipes.ComponentArray;
  getValueOfObject: (x: Recipes.Component) => string;
  getIdOfObject: (x: Recipes.Component) => string;
  inputChangeHandler: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    x: Recipes.Component,
    i: number
  ) => void;
  addObjectHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  deleteObjectHandler: (i: number) => void;
  showCancelBtn: boolean;
  cancelHandler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

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
  showCancelBtn,
  cancelHandler,
}: InputFormProps) => {
  return (
    <section className={styles.inputForm}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>{title}</h2>
        {showCancelBtn && (
          <button className={styles.cancelEditBtn} onClick={cancelHandler}>
            Cancel edit
          </button>
        )}
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
                  onChange={(e) => inputChangeHandler(e, object, i)}
                />
              ) : (
                <textarea
                  className={styles.input}
                  id={`${objectName}-${i + 1}`}
                  value={getValueOfObject(object)}
                  onChange={(e) => inputChangeHandler(e, object, i)}
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

export { InputForm };
