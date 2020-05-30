import React from "react";
import styles from "./SplashPage.module.css";
import { LoadingSpinner } from "../LoadingSpinner";

const SplashPage = () => (
  <main className={styles.splashPage}>
    <h1 className={styles.appName}>Recipe Developer</h1>
    <LoadingSpinner />
  </main>
);

export { SplashPage };
