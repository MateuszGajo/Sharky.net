import React from "react";
import styles from "./SecondaryInput.module.scss";

const SecondaryInput = ({ placeholder, type = "text", value, onChange }) => {
  return (
    <div className={styles.container}>
      <input
        type={type}
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <h2 className={styles.placeholder}>{placeholder}</h2>
    </div>
  );
};

export default SecondaryInput;
