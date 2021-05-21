import React, { useEffect } from "react";
import Authentication from "~layout/homeLayout/Authentication/Authentication";
import * as MultiStepForm from "~components/multiStepForm/MultiStepForm";
import Loading from "~common/Loading/Loading";
import { observer } from "mobx-react-lite";
import { useAuthenticationStore } from "~root/src/app/providers/RootStoreProvider";
import PublicRoute from "~root/src/features/routes/PublicRoute";

const SignUp = () => {
  const { loading, loadRegisterValues } = useAuthenticationStore();

  useEffect(() => {
    loadRegisterValues();
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

export async function getServerSideProps() {
  return {};
}

export default PublicRoute(observer(SignUp));
