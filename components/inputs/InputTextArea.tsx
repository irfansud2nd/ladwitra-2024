import { ErrorMessage, FormikProps } from "formik";
import React from "react";
import ErrorText from "../utils/ErrorText";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type InputTextAreaProps = {
  label: string;
  name: string;
  formik: FormikProps<any>;
};

const InputTextArea = ({ label, name, formik }: InputTextAreaProps) => {
  const {
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    values,
    setFieldTouched,
  } = formik;
  return (
    <div className="input_container">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        onBlur={() => setFieldTouched(name, true)}
        disabled={isSubmitting}
        onChange={(e) => setFieldValue(name, e.target.value)}
        value={values[name]}
        className={`resize-none 
        ${errors[name] && touched[name] && "border-destructive"}`}
        rows={3}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputTextArea;
