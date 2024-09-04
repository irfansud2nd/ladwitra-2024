import axios from "axios";
import { axiosFileConfig } from "../constants";
import { Person, SetFieldValue } from "./FormConstants";
import { OfficialState } from "../silat/official/officialConstants";
import { AtletState } from "../silat/atlet/atletConstants";
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
import { toastFirebaseError } from "../functions";

// SEND FILE
export const sendFile = async (file: File, directory: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);
  return axios
    .post("/api/file", formData, axiosFileConfig)
    .then((res) => {
      return res.data.downloadUrl as string;
    })
    .catch((error) => {
      throw error;
    });
};

// SET FIELD VALUES
export const setFieldValues = (setFieldValue: SetFieldValue, data: any) => {
  for (const key in data) {
    setFieldValue(key, data[key]);
  }
};

// DELETE ALL PERSON
export const deletePersons = async (
  persons: Person[],
  persontType: "atlet" | "official" | "penari" | "koreografer",
  toastId: string | number
) => {
  try {
    if (persons.length) {
      for (let i = 0; i < persons.length; i++) {
        toast.loading(`Menghapus ${persontType} ${i + 1}/${persons.length}`, {
          id: toastId,
        });
        switch (persontType) {
          case "official":
            await deleteOfficial(persons[i] as OfficialState);
            break;
          case "atlet":
            await deleteAtlet(persons[i] as AtletState);
            break;
          case "penari":
            await deletePenari(persons[i] as PenariState);
            break;
          case "koreografer":
            await deleteKoreografer(persons[i] as KoreograferState);
            break;
        }
      }
    }
    toast.success(
      `Berhasil menghapus ${persontType} ${persons.length}/${persons.length}`,
      { id: toastId }
    );
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const updatePersons = async (
  persons: Person[],
  persontType: "atlet" | "official" | "penari" | "koreografer",
  changeData: (data: Person) => Person,
  toastId?: string | number
) => {
  let newPersons: Person[] = [];
  try {
    if (persons.length) {
      newPersons = persons.map((person) => changeData(person));
      for (let i = 0; i < persons.length; i++) {
        toast.loading(
          `Mengperbaharui ${persontType} ${i + 1}/${persons.length}`,
          {
            id: toastId,
          }
        );
        switch (persontType) {
          case "official":
            await updateOfficial(newPersons[i] as OfficialState, false);
            break;
          case "atlet":
            await updateAtlet(newPersons[i] as AtletState, false);
            break;
          case "penari":
            await updatePenari(newPersons[i] as PenariState);
            break;
          case "koreografer":
            await updateKoreografer(newPersons[i] as KoreograferState);
            break;
        }
      }
    }
    toast.success(
      `Berhasil mengperbaharui ${persontType} ${persons.length}/${persons.length}`,
      { id: toastId }
    );
    return newPersons;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const getFileUrl = (
  type: "atlet" | "penari" | "official" | "koreografer" | "payment",
  id: string
) => {
  return {
    fotoUrl: `${type}s/pasFoto/${id}`,
    kkUrl: `${type}s/kk/${id}`,
    ktpUrl: `${type}s/ktp/${id}`,
    buktiUrl: `payments/${id}`,
  };
};
