import React, { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { SignupFormValues as FormValue } from "~root/src/app/models/user";
import StepWrapper from "./components/stepWrapper/StepWrrapper";
import Step from "./components/step/Step";
import Controls from "./components/controls/Controls";
import CredsForm from "./components/credsForm/CredsForm";
import PersonalForm from "./components/personalForm/PersonalForm";
import { registerValidationSchema as validationSchema } from "~utils/utils";
import agent from "~api/agent";
import { useStore } from "~root/src/app/stores/store";

const SaveValues = () => {
  const { values } = useFormikContext<FormValue>();
  const { password, confirmPassword, ...formValues } = values;
  useEffect(() => {
    window.onbeforeunload = () => {
      sessionStorage.setItem("registerFormValues", JSON.stringify(formValues));
    };
  });
  return null;
};

interface Props {
  children: React.ReactNode;
}

const Wizzard: React.FC<Props> = ({ children }) => {
  const { multiStepStore } = useStore();
  const { initialFormValues: initialValues, touchedFields } = multiStepStore;

  const handleSubmitForm = (user: FormValue) => {
    console.log("Hello");
    console.log(user);
    agent.Account.register(user)
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema()}
      validateOnMount={true}
      onSubmit={(values) => handleSubmitForm(values)}
      enableReinitialize
      initialTouched={touchedFields}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <SaveValues />
            {children}
          </Form>
        );
      }}
    </Formik>
  );
};

export { Wizzard, Step, StepWrapper, Controls, CredsForm, PersonalForm };
