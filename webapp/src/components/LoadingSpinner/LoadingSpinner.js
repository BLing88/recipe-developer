import React, { useState, useEffect } from "react";
import styles from "./LoadingSpinner.module.css";

const { cos, sin, PI } = Math;
const angularSpeed = 1000 / 25;
const DEFAULT_SIZE = "DEFAULT";
const SMALL_SIZE = "SMALL";

const LoadingSpinner = ({ size = DEFAULT_SIZE }) => {
  const [theta, setTheta] = useState(PI / 2);
  let svgWidth, CENTER_RADIUS, DOT_RADIUS;
  switch (size) {
    case SMALL_SIZE:
      svgWidth = 75;
      CENTER_RADIUS = 5;
      DOT_RADIUS = 3;
      break;
    default:
      svgWidth = 150;
      CENTER_RADIUS = 7;
      DOT_RADIUS = 5;
  }
  const svgHeight = svgWidth;
  const radius = svgWidth / 4;
  const updateTheta = theta => (theta + (2 * PI) / angularSpeed) % (2 * PI);
  const xPos = theta => radius * cos(theta);
  const yPos = theta => radius * sin(theta);

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
        r={CENTER_RADIUS}
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 - xPos(theta)}
        cy={svgHeight / 2 - yPos(theta)}
        r={DOT_RADIUS}
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 + xPos(theta)}
        cy={svgHeight / 2 + yPos(theta)}
        r={DOT_RADIUS}
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 - xPos(theta - PI / 2)}
        cy={svgHeight / 2 - yPos(theta - PI / 2)}
        r={DOT_RADIUS}
      />
      <circle
        className={styles.spinnerDot}
        cx={svgWidth / 2 + xPos(theta - PI / 2)}
        cy={svgHeight / 2 + yPos(theta - PI / 2)}
        r={DOT_RADIUS}
      />
    </svg>
  );
};

export { LoadingSpinner };
