import React, { useEffect } from "react";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import * as MultiStepForm from "~components/multiStepForm/MultiStepForm";
import { useStore } from "~root/src/app/stores/store";
import Loading from "~common/Loading/Loading";
import { observer } from "mobx-react-lite";

const index = () => {
  const { multiStepStore } = useStore();
  const { loading, loadInitialFormValues } = multiStepStore;

  useEffect(() => {
    loadInitialFormValues();
  }, []);

  return (
    <Authentication type="signup">
      {loading ? (
        <Loading />
      ) : (
        <MultiStepForm.Wizzard>
          <MultiStepForm.StepWrapper>
            <MultiStepForm.Step dataKey="Step">
              <MultiStepForm.CredsForm />
            </MultiStepForm.Step>
            <MultiStepForm.Step dataKey="Step">
              <MultiStepForm.PersonalForm />
            </MultiStepForm.Step>
          </MultiStepForm.StepWrapper>
          <MultiStepForm.Controls />
        </MultiStepForm.Wizzard>
      )}
    </Authentication>
  );
};

export default observer(index);
