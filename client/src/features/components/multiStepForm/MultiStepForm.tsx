import React, { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { observer } from "mobx-react-lite";
import { SignupFormValues as FormValue } from "~root/src/app/models/authentication";
import StepWrapper from "./components/stepWrapper/StepWrrapper";
import Step from "./components/step/Step";
import Controls from "./components/controls/Controls";
import CredsForm from "./components/credsForm/CredsForm";
import PersonalForm from "./components/personalForm/PersonalForm";
import { registerValidationSchema as validationSchema } from "~utils/utils";
import { useAuthenticationStore } from "~root/src/app/providers/RootStoreProvider";

const SaveValues: React.FC<{ saveValues: boolean }> = ({ saveValues }) => {
  const { values } = useFormikContext<FormValue>();
  const { password, confirmPassword, ...formValues } = values;
  useEffect(() => {
    window.onbeforeunload = () => {
      saveValues &&
        sessionStorage.setItem(
          "registerFormValues",
          JSON.stringify(formValues)
        );
    };
  });
  return null;
};

interface Props {
  children: React.ReactNode;
}

const Wizzard: React.FC<Props> = observer(({ children }) => {
  const {
    initialFormValues: initialValues,
    touchedFields,
    register,
  } = useAuthenticationStore();

  const [saveValues, setStatusOfSaveValues] = useState(true);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema()}
      validateOnMount={true}
      onSubmit={(values, { setErrors, setTouched, setStatus }) =>
        register(
          values,
          setErrors,
          setTouched,
          setStatus,
          setStatusOfSaveValues
        )
      }
      enableReinitialize
      initialTouched={touchedFields}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <SaveValues saveValues={saveValues} />
            {children}
          </Form>
        );
      }}
    </Formik>
  );
});

export { Wizzard, Step, StepWrapper, Controls, CredsForm, PersonalForm };
