"use client";
import { ErrorMessage, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ErrorText from "../utils/ErrorText";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { calculateAge } from "@/utils/silat/atlet/atletFunctions";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { editOnly } from "@/utils/constants";

type InputFileProps = {
  label: string;
  name: string;
  formik: FormikProps<any>;
  urlName: string;
  landscape?: boolean;
  under17?: boolean;
  className?: string;
  showOnEditOnly?: boolean;
};

const InputFile = ({
  label,
  name,
  formik,
  urlName,
  under17,
  landscape,
  className,
  showOnEditOnly,
}: InputFileProps) => {
  const { setFieldValue, errors, touched, values, isSubmitting } = formik;
  const downloadUrl = values[urlName];
  const file = values[name];
  let umur;
  if (under17) {
    umur = calculateAge(values.lahir.tanggal);
  }

  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [skeleton, setSkeleton] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  // RESET IMAGE INPUT
  const clearInputImage = () => {
    if (inputRef.current) inputRef.current.value = "";
    setFieldValue(name, "");
    setImagePreviewSrc("");
  };

  // SET PREVIEW IF DOWNLOADURL
  useEffect(() => {
    if (!file) setImagePreviewSrc(downloadUrl);
  }, [downloadUrl, file]);

  // VALIDATE FILE SIZE AND FORMAT
  useEffect(() => {
    const maxSize = 1 * 1024 * 1024; //1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file) {
      if (file.size > maxSize) {
        toast.error("File yang anda pilih lebih dari 1MB");
        clearInputImage();
      } else if (!allowedTypes.includes(file.type)) {
        toast.error("File yang dipilih tidak valid (harus png, jpg, jpeg)");
        clearInputImage();
      } else {
        setImagePreviewSrc(URL.createObjectURL(file));
      }
    } else if (!downloadUrl) {
      clearInputImage();
    }
  }, [file]);

  return (
    <div
      className={`input_container w-[150px] 
      ${landscape ? "w-[250px]" : "w-[150px]"}
      ${className} 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label htmlFor={name}>
        {label}
        {under17 ? (
          <Badge className="px-1 py-0  pb-0.5 ml-1">
            {umur && umur >= 17 ? "Atlet" : "Orang Tua"}
          </Badge>
        ) : null}
        <span className="text-muted-foreground text-xs ml-1">(Max 1 MB)</span>
      </Label>
      <div
        className={`border rounded-md flex justify-center items-center relative
          ${errors[name] && touched[name] && "border-destructive"}
          ${landscape ? "w-[250px] h-[150px]" : "w-[150px] h-[200px]"}
          `}
      >
        {imagePreviewSrc && (
          <>
            <img
              src={imagePreviewSrc}
              className={`transition-all object-contain object-center
              ${skeleton ? "opacity-0" : "opacity-100"}
              ${landscape ? "w-[250px] h-[150px]" : "w-[150px] h-[200px]"}
              `}
              onLoad={() => setSkeleton(false)}
            />
            {skeleton && <Skeleton className="w-full h-full absolute" />}
          </>
        )}
      </div>
      <input
        ref={inputRef}
        onChange={(e) => {
          e.target.files?.length && setFieldValue(name, e.target.files[0]);
        }}
        accept=".jpg, .jpeg, .png"
        name={name}
        type="file"
        className={landscape ? "input_file_landscape" : "input_file"}
        disabled={isSubmitting}
      />
      <ErrorMessage name={name} component={ErrorText} />
    </div>
  );
};

export default InputFile;
