import React from "react";
import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return (
    <div
      data-testid="loading-spinner"
      style={{ width, height }}
      className={styles.loadingSpinner}
    ></div>
  );
};
