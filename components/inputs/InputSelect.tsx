"use client";
import { Field, FieldProps, FormikErrors, FormikProps } from "formik";
import React, { useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { editOnly } from "@/utils/constants";

type InputSelectProps = {
  name: string;
  label: string;
  options: any[];
  formik: FormikProps<any>;
  customOptionLabel?: (option: any) => string;
  dynamicOptions?: boolean;
  onChange?: (value: any) => void;
  forceDisabled?: boolean;
  forceValue?: string;
  showOnEditOnly?: boolean;
  onEdit?: boolean;
};

const InputSelect = ({
  name,
  label,
  options,
  formik,
  customOptionLabel,
  dynamicOptions,
  onChange,
  forceDisabled,
  forceValue,
  showOnEditOnly,
  onEdit,
}: InputSelectProps) => {
  const { setFieldValue, values, isSubmitting } = formik;
  const value = values[name];

  useEffect(() => {
    if (options.length && dynamicOptions) {
      if (onEdit && options.includes(value)) return;
      setFieldValue(name, options[0]);
    }
  }, [options]);

  useEffect(() => {
    if (forceValue && value != forceValue) setFieldValue(name, forceValue);
  }, [forceValue]);

  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label>{label}</Label>
      <Select
        onValueChange={(value) => {
          onChange && onChange(value);
          setFieldValue(name, value);
        }}
        value={forceValue ? forceValue : value}
        disabled={forceDisabled ? true : isSubmitting}
      >
        <SelectTrigger>
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option} key={option}>
              {customOptionLabel ? customOptionLabel(option) : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InputSelect;
