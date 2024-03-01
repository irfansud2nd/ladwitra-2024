import axios from "axios";
import { axiosFileConfig } from "../constants";
import { FormikErrors } from "formik";
import { Persons, SetSubmitting, setFieldValue } from "./FormConstants";
import { OfficialState } from "../silat/official/officialConstants";
import { AtletState } from "../silat/atlet/atletConstats";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import {
  deleteOfficial,
  updateOfficial,
} from "../silat/official/officialFunctions";
import { deleteAtlet, updateAtlet } from "../silat/atlet/atletFunctions";
import { PenariState } from "../jaipong/penari/penariConstants";
import { KoreograferState } from "../jaipong/koreografer/koreograferConstants";
import { deletePenari, updatePenari } from "../jaipong/penari/penariFunctions";
import {
  deleteKoreografer,
  updateKoreografer,
} from "../jaipong/koreografer/koreograferFunctions";

// SEND FILE
export const sendFile = async (file: File, directory: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);
  return axios
    .post("/api/file", formData, axiosFileConfig)
    .then((res) => {
      return res.data.downloadUrl;
    })
    .catch((error) => {
      throw error;
    });
};

// SET FIELD VALUES
export const setFieldValues = (setFieldValue: setFieldValue, data: any) => {
  for (const key in data) {
    setFieldValue(key, data[key]);
  }
};

// DELETE ALL PERSON
export const deletePersons = (
  datas: Persons[],
  persontType: "atlet" | "official" | "penari" | "koreografer",
  dispatch: Dispatch<UnknownAction>,
  onComplete: () => void,
  toastId: string | number
) => {
  if (!datas || !datas.length) {
    onComplete();
    return;
  }
  const repeater = (index: number) => {
    if (index >= datas.length) {
      toast.success(
        `Berhasil menghapus ${persontType} ${index}/${datas.length}`,
        { id: toastId }
      );
      onComplete();
      return;
    }
    toast.loading(`Menghapus ${persontType} ${index + 1}/${datas.length}`, {
      id: toastId,
    });
    const data = datas[index];
    const repeat = () => repeater(index + 1);
    persontType == "official" &&
      deleteOfficial(data as OfficialState, dispatch, undefined, repeat, false);
    persontType == "atlet" &&
      deleteAtlet(data as AtletState, dispatch, undefined, repeat, false);
    persontType == "penari" &&
      deletePenari(data as PenariState, dispatch, undefined, repeat, false);
    persontType == "koreografer" &&
      deleteKoreografer(
        data as KoreograferState,
        dispatch,
        undefined,
        repeat,
        false
      );
  };
  repeater(0);
};

// DELETE ALL PERSON
export const updatePersons = (
  datas: Persons[],
  persontType: "atlet" | "official" | "penari" | "koreografer",
  changeData: (data: Persons) => Persons,
  dispatch: Dispatch<UnknownAction>,
  onComplete: () => void,
  setSubmitting: SetSubmitting,
  toastId: string | number
) => {
  if (!datas || !datas.length) {
    onComplete();
    return;
  }
  const repeater = (index: number) => {
    if (index >= datas.length) {
      onComplete();
      toast.success(
        `Berhasil memperbaharui ${persontType} ${index}/${datas.length}`,
        { id: toastId }
      );
      return;
    }
    toast.loading(`Memperbaharui ${persontType} ${index + 1}/${datas.length}`, {
      id: toastId,
    });
    const oldData = datas[index];
    const newData = changeData(oldData);
    const repeat = () => repeater(index + 1);
    persontType == "official" &&
      updateOfficial(
        newData as OfficialState,
        dispatch,
        setSubmitting,
        repeat,
        false
      );
    persontType == "atlet" &&
      updateAtlet(
        newData as AtletState,
        dispatch,
        setSubmitting,
        repeat,
        false
      );
    persontType == "penari" &&
      updatePenari(
        newData as PenariState,
        dispatch,
        setSubmitting,
        repeat,
        false
      );
    persontType == "koreografer" &&
      updateKoreografer(
        newData as KoreograferState,
        dispatch,
        setSubmitting,
        repeat,
        false
      );
  };
  repeater(0);
};
