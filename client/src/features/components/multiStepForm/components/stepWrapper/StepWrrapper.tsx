import React, { useEffect } from "react";
import { useStore } from "~root/src/app/stores/store";

interface Props {
  children: any;
}

const StepWrapper: React.FC<Props> = ({ children }) => {
  const { authenticationStore } = useStore();
  const { setNumberOfPages } = authenticationStore;

  let amountOfPages = 0;
  const childrenCloned = children?.map((item: any) => {
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

export default StepWrapper;
