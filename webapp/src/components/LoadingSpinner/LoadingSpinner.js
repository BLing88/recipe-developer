import React, { useState, useEffect } from "react";
import styles from "./LoadingSpinner.module.css";

const svgWidth = 150;
const svgHeight = 150;
const radius = 150 / 4;
const { cos, sin, PI } = Math;
const angularSpeed = 1000 / 25;

const updateTheta = theta => (theta + (2 * PI) / angularSpeed) % (2 * PI);
const xPos = theta => radius * cos(theta);
const yPos = theta => radius * sin(theta);

const LoadingSpinner = () => {
  const [theta, setTheta] = useState(PI / 2);

  useEffect(() => {
    const interval = setInterval(() => setTheta(updateTheta), angularSpeed);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* <circle
        cx={svgWidth / 2}
        cy={svgHeight / 2}
        r={radius}
        fill="none"
        stroke="rgb(11, 162, 254)"
        strokeWidth={2}
      /> */}
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2}
        cy={svgHeight / 2}
        r={7}
        fill="rgb(11, 162, 254)"
        stroke="rgb(11, 162, 254)"
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 - xPos(theta)}
        cy={svgHeight / 2 - yPos(theta)}
        r={5}
        fill="rgb(11, 162, 254)"
        stroke="rgb(11, 162, 254)"
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 + xPos(theta)}
        cy={svgHeight / 2 + yPos(theta)}
        r={5}
        fill="rgb(11, 162, 254)"
        stroke="rgb(11, 162, 254)"
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 - xPos(theta - PI / 2)}
        cy={svgHeight / 2 - yPos(theta - PI / 2)}
        r={5}
        fill="rgb(11, 162, 254)"
        stroke="rgb(11, 162, 254)"
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 + xPos(theta - PI / 2)}
        cy={svgHeight / 2 + yPos(theta - PI / 2)}
        r={5}
        fill="rgb(11, 162, 254)"
        stroke="rgb(11, 162, 254)"
      />
    </svg>
  );
};

export { LoadingSpinner };
