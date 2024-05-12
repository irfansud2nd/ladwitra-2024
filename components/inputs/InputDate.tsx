"use client";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import React from "react";
import ErrorText from "../utils/ErrorText";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { editOnly } from "@/utils/constants";
type InputDateProps = {
  formik: FormikProps<any>;
  showOnEditOnly?: boolean;
};
const InputDate = ({ formik, showOnEditOnly }: InputDateProps) => {
  const { values, setFieldValue, isSubmitting } = formik;
  const value = values.lahir.tanggal;
  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label>Tanggal Lahir</Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => setFieldValue("tanggalLahir", e.target.value)}
        disabled={isSubmitting}
      />
      <ErrorMessage name="tanggalLahir" component={ErrorText} />
    </div>
  );
};

export default InputDate;
