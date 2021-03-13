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
import Loading from "~common/Loading/Loading";

const SaveValues = () => {
  const { values } = useFormikContext<FormValue>();
  useEffect(() => {
    window.onbeforeunload = () => {
      sessionStorage.setItem("registerFormValues", JSON.stringify(values));
    };
  });
  return null;
};

interface Props {
  children: React.ReactNode;
}

const Wizzard: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  const handleSubmitForm = (user: FormValue) => {
    console.log("Hello");
    agent.Account.login(user)
      .then((resp) => console.log(resp))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const values = sessionStorage.getItem("registerFormValues");
    if (values) {
      try {
        const valuesParsed = JSON.parse(values);
        setUser({ ...user, ...valuesParsed });
        setLoading(false);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) return <Loading />;

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
