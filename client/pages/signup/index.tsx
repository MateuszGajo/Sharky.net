import React from "react";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import * as MultiStepForm from "~components/multiStepForm/MultiStepForm";

const index = () => {
  return (
    <Authentication type="signup">
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
    </Authentication>
  );
};

export default index;
