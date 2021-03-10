import React, { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import { UserFormValue } from "~root/src/app/models/user";
import StepWrapper from "./components/stepWrapper/StepWrrapper";
import Step from "./components/step/Step";
import Controls from "./components/controls/Controls";
import CredsForm from "./components/credsForm/CredsForm";
import PersonalForm from "./components/personalForm/PersonalForm";
import { registerValidationSchema as validationSchema } from "~utils/utils";

const SaveValues = () => {
  const { values } = useFormikContext<UserFormValue>();
  useEffect(() => {
    window.onbeforeunload = function () {
      console.log(values);
      localStorage.setItem("registerFormValues", JSON.stringify(values));
    };
  });
  return null;
};

const Wizzard = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmitForm = (user) => {
    console.log(user);
  };

  useEffect(() => {
    const values = localStorage.getItem("registerFormValues");
    if (values) {
      try {
        const valuesParsed = JSON.parse(values);
        setUser({ ...user, ...valuesParsed });
      } catch {}
    }
  }, []);

  return (
    <Formik
      initialValues={user}
      validationSchema={validationSchema()}
      onSubmit={(values) => handleSubmitForm(values)}
      enableReinitialize
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
