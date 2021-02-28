import React from "react";
import style from "./Preview.module.scss";
import { Button } from "semantic-ui-react";

const Preview = ({ file, setFile, getRootProps, getInputProps }) => {
  return (
    <>
      {file.length ? (
        <div style={{ position: "relative" }}>
          <img src={file[0]?.preview} className={style["img-preview"]} />
          <span className={style["cancel-image"]}>
            <Button
              icon="cancel"
              color="red"
              size="tiny"
              onClick={() => setFile([])}
            />
          </span>
        </div>
      ) : (
        <span
          {...getRootProps({
            onDrop: (event) => event.stopPropagation(),
          })}
        >
          <Button positive icon="plus" />
          <input {...getInputProps()} />
        </span>
      )}
    </>
  );
};

export default Preview;
