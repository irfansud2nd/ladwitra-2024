import { ErrorMessage, FormikProps } from "formik";
import React from "react";
import ErrorText from "../utils/ErrorText";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { editOnly } from "@/utils/constants";

type InputTextAreaProps = {
  label: string;
  name: string;
  formik: FormikProps<any>;
  showOnEditOnly?: boolean;
};

const InputTextArea = ({
  label,
  name,
  formik,
  showOnEditOnly,
}: InputTextAreaProps) => {
  const {
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    values,
    setFieldTouched,
  } = formik;
  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
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
