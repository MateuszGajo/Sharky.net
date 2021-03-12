import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useStore } from "~root/src/app/stores/store";

const StepWrapper = ({ children }) => {
  const { multiStepStore } = useStore();
  const { setNumberOfPages } = multiStepStore;

  let amountOfPages = 0;
  const childrenCloned = children.map((item) => {
    if (item.props.dataKey === "Step") {
      amountOfPages += 1;
      return React.cloneElement(item, {
        pageIndex: amountOfPages,
        key: amountOfPages,
      });
    }
    return item;
  });

  useEffect(() => {
    setNumberOfPages(amountOfPages);
  }, []);

  return childrenCloned;
};

StepWrapper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
};

export default StepWrapper;
