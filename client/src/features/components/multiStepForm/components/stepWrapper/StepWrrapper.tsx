import React, { useEffect } from "react";
import { useAuthenticationStore } from "~root/src/app/providers/RootStoreProvider";

interface Props {
  children: any;
}

const StepWrapper: React.FC<Props> = ({ children }) => {
  const { setNumberOfPages } = useAuthenticationStore();

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
