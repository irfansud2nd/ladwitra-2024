import { firestore } from "@/lib/firebase";
import {
  deleteKontingenRedux,
  setKontingenToEditRedux,
  updateKontingenRedux,
} from "@/utils/redux/silat/kontingenSlice";
import {
  KontingenState,
  kontingenInitialValue,
} from "@/utils/silat/kontingen/kontingenConstants";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import axios from "axios";
import { collection, doc } from "firebase/firestore";
import { toast } from "sonner";
import { OfficialState } from "../official/officialConstants";
import { AtletState } from "../atlet/atletConstats";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import { deletePersons, updatePersons } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";

// SEND KONTINGEN
export const sendKontingen = async (kontingen: KontingenState) => {
  const { id } = doc(collection(firestore, "kontingens"));
  const toastId = toast.loading("Mendaftarkan Kontingen");
  const data: KontingenState = {
    ...kontingen,
    id,
  };
  return axios
    .post("/api/kontingens", data)
    .then(() => {
      toast.success("Kontingen berhasil didaftarkan", { id: toastId });
      return data;
    })
    .catch((error) => {
      toast.error(`${error.message} | ${error.code}`, { id: toastId });
    });
};

// MANAGE PERSON ON KONTINGEN
export const managePersonOnKontingen = async (
  kontingen: KontingenState,
  tipe: "officials" | "atlets",
  personId: string,
  action: "add" | "delete",
  dispatch: Dispatch<UnknownAction>
) => {
  let data: KontingenState =
    action == "add"
      ? {
          ...kontingen,
          [tipe]: [...kontingen[tipe], personId],
        }
      : {
          ...kontingen,
          [tipe]: [...kontingen[tipe]].filter((item) => item != personId),
        };

  return axios
    .patch("/api/kontingens", data)
    .then((res) => {
      dispatch(updateKontingenRedux(data));
    })
    .catch((error) => {
      throw error;
    });
};

// UPDATE KONTINGEN
export const updateKontingen = (
  newKontingen: KontingenState,
  oldKontingen: KontingenState,
  officials: OfficialState[],
  atlets: AtletState[],
  dispatch: Dispatch<UnknownAction>,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting,
  onComplete?: () => void,
  prevToastId?: string | number
) => {
  const toastId = prevToastId
    ? prevToastId
    : toast.loading("Memperbaharui data kontingen");
  const changePersonData = (data: any) => ({
    ...data,
    namaKontingen: newKontingen.nama,
  });
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF NAME CHANGED
        if (oldKontingen.nama != newKontingen.nama) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // CHANGE OFFICIAL.NAMAKONTINGEN
        updatePersons(
          officials,
          "official",
          changePersonData,
          dispatch,
          () => stepController(3),
          setSubmitting,
          toastId
        );
        break;
      case 3:
        // CHANGE PESERTA.NAMAKONTINGEN
        updatePersons(
          atlets,
          "atlet",
          changePersonData,
          dispatch,
          () => stepController(4),
          setSubmitting,
          toastId
        );
        break;
      case 4:
        // UPDATE KONTINGEN
        toast.loading("Memperbaharui data kontingen", { id: toastId });
        axios
          .patch("/api/kontingens", newKontingen)
          .then((res) => {
            toast.success("Kontingen berhasil diperbaharui", { id: toastId });
            dispatch(updateKontingenRedux(newKontingen));
            dispatch(setKontingenToEditRedux(kontingenInitialValue));
            onComplete && onComplete();
            resetForm && resetForm();
            setSubmitting && setSubmitting(false);
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};

// DELETE KONTINGEN
export const deleteKontingen = (
  kontingen: KontingenState,
  officials: OfficialState[],
  atlets: AtletState[],
  dispatch: Dispatch<UnknownAction>,
  onComplete?: () => {}
) => {
  const toastId = toast.loading("Menghapus data kontingen");
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE ATLETS
        if (!atlets.length) {
          stepController(2);
          return;
        }
        deletePersons(
          atlets,
          "atlet",
          dispatch,
          () => stepController(2),
          toastId
        );
        break;
      case 2:
        // DELETE OFFICIALS
        if (!officials.length) {
          stepController(3);
          return;
        }
        deletePersons(
          officials,
          "official",
          dispatch,
          () => stepController(3),
          toastId
        );
        break;
      case 3:
        // DELETE KONTINGEN
        toast.loading("Menghapus kontingen", { id: toastId });
        axios
          .delete(`/api/kontingens/${kontingen.creatorEmail}/${kontingen.id}`)
          .then((res) => {
            toast.success("Kontingen berhasil dihapus", { id: toastId });
            dispatch(deleteKontingenRedux());
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};
