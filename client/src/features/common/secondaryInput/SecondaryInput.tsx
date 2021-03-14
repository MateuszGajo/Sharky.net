import React, { useEffect, useRef, useState } from "react";
import cx from "classnames";
import { useField } from "formik";
import { Label } from "semantic-ui-react";
import styles from "./SecondaryInput.module.scss";

interface Props {
  placeholder: string;
  type?: string;
  fluid?: boolean;
  name: string;
}

const SecondaryInput: React.FC<Props> = ({
  placeholder,
  type = "text",
  fluid = false,
  name,
}) => {
  const [isActive, setActive] = useState(false);

  const [field, meta] = useField(name);
  const input = useRef<HTMLInputElement | null>(null);
  const { onChange, ...fieldsProperty } = field;

  const property = {
    type: type,
    className: styles.input,
    ...fieldsProperty,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== "" && isActive === false) setActive(true);
    else if (e.target.value === "" && isActive === true) setActive(false);
    onChange(e);
  };

  useEffect(() => {}, [field]);

  useEffect(() => {
    if (input.current?.value) setActive(true);
  }, [input]);

  return (
    <div
      className={cx(styles.container, {
        [styles.fluid]: fluid,
      })}
    >
      <input {...property} onChange={handleChange} ref={input} />
      <h2
        className={cx(styles.placeholder, {
          [styles.inputActive]: isActive,
        })}
        onClick={() => input.current?.focus()}
      >
        {placeholder}
      </h2>
      {meta.touched && meta.error ? (
        <div className={styles.error}>
          <Label basic color="red">
            {meta.error}
          </Label>
        </div>
      ) : null}
    </div>
  );
};

export default SecondaryInput;
