import { ErrorMessage, FormikProps } from "formik";
import React from "react";
import ErrorText from "../utils/ErrorText";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { calculateAge } from "@/utils/silat/atlet/atletFunctions";
import { editOnly } from "@/utils/constants";

type InputTextProps = {
  label: string;
  name: string;
  formik: FormikProps<any>;
  upperCase?: boolean;
  under17?: boolean;
  helperText?: string;
  forceDisabled?: boolean;
  forceValue?: string;
  showOnEditOnly?: boolean;
};

const InputText = ({
  label,
  name,
  under17,
  formik,
  upperCase,
  helperText,
  forceDisabled,
  forceValue,
  showOnEditOnly,
}: InputTextProps) => {
  const {
    errors,
    touched,
    isSubmitting,
    values,
    setFieldValue,
    setFieldTouched,
  } = formik;
  const value = values[name];

  let umur;
  if (under17) {
    umur = calculateAge(values.tanggalLahir);
  }
  return (
    <div
      className={`input_container 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label>
        {label}
        {under17 ? (
          <Badge className="px-1 py-0  pb-0.5 ml-1">
            {umur && umur >= 17 ? "Atlet" : "Orang Tua"}
          </Badge>
        ) : null}
        {helperText && (
          <span className="text-muted-foreground text-xs ml-1">
            {helperText}
          </span>
        )}
      </Label>
      <Input
        onBlur={() => setFieldTouched(name, true)}
        type="text"
        className={`${errors[name] && touched[name] && "border-destructive"}`}
        value={forceValue ? forceValue : value}
        onChange={(e) =>
          setFieldValue(
            name,
            upperCase ? e.target.value.toUpperCase() : e.target.value
          )
        }
        disabled={forceDisabled ? true : isSubmitting}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputText;
