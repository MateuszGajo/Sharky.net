import React, { useRef } from "react";
import styles from "./SecondaryInput.module.scss";
import cx from "classnames";
import { useField } from "formik";
import { Label } from "semantic-ui-react";

interface Props {
  placeholder: string;
  type?: string;
  fluid?: boolean;
  name?: string;
}

const SecondaryInput: React.FC<Props> = ({
  placeholder,
  type = "text",
  fluid = false,
  name,
}) => {
  const [field, meta] = useField(name);
  const input = useRef(null);

  const property = {
    type: type,
    className: styles.input,
    required: true,
    ...field,
  };

  return (
    <div
      className={cx(styles.container, {
        [styles.fluid]: fluid,
      })}
    >
      <input {...property} ref={input} />
      <h2 className={styles.placeholder} onClick={() => input.current.focus()}>
        {placeholder}
      </h2>
      {meta.touched && meta.error ? (
        <Label basic color="red">
          {meta.error}
        </Label>
      ) : null}
    </div>
  );
};

export default SecondaryInput;
