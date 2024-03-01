"use client";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import React from "react";
import ErrorText from "../utils/ErrorText";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
type InputDateProps = {
  formik: FormikProps<any>;
};
const InputDate = ({ formik }: InputDateProps) => {
  const { values, setFieldValue, isSubmitting } = formik;
  const value = values.tanggalLahir;
  return (
    <div className="input_container">
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
