import { collection, doc } from "firebase/firestore";
import { SanggarState, sanggarInitialValue } from "./sanggarConstants";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import axios from "axios";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { ResetForm, SetSubmitting } from "@/utils/form/FormConstants";
import {
  deleteSanggarRedux,
  setSanggarRedux,
  setSanggarToEditRedux,
  updateSanggarRedux,
} from "@/utils/redux/jaipong/sanggarSlice";
import { PenariState } from "../penari/penariConstants";
import { deletePersons, updatePersons } from "@/utils/form/FormFunctions";
import { KoreograferState } from "../koreografer/koreograferConstants";
import { toastFirebaseError } from "@/utils/functions";

// SEND SANGGAR
export const sendSanggar = async (
  sanggar: SanggarState,
  dispatch: Dispatch<UnknownAction>,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting
) => {
  const { id } = doc(collection(firestore, "sanggars"));
  const toastId = toast.loading("Mendaftarkan Sanggar");
  const data: SanggarState = {
    ...sanggar,
    id,
  };
  return axios
    .post("/api/sanggars", data)
    .then(() => {
      toast.success("Sanggar berhasil didaftarkan", { id: toastId });
      dispatch(setSanggarRedux(data));
    })
    .catch((error) => {
      toast.error(`${error.message} | ${error.code}`, { id: toastId });
    })
    .finally(() => {
      resetForm();
      setSubmitting(false);
    });
};

// MANAGE PERSON ON SANGGAR
export const managePersonOnSanggar = async (
  sanggar: SanggarState,
  tipe: "koreografers" | "penaris",
  penariId: string,
  action: "add" | "delete",
  dispatch: Dispatch<UnknownAction>
) => {
  let data: SanggarState =
    action == "add"
      ? {
          ...sanggar,
          [tipe]: [...sanggar[tipe], penariId],
        }
      : {
          ...sanggar,
          [tipe]: [...sanggar[tipe]].filter((item) => item != penariId),
        };

  return axios
    .patch("/api/sanggars", data)
    .then((res) => {
      dispatch(updateSanggarRedux(data));
    })
    .catch((error) => {
      throw error;
    });
};

// UPDATE SANGGAR
export const updateSanggar = (
  newSanggar: SanggarState,
  oldSanggar: SanggarState,
  koreografers: KoreograferState[],
  penari: PenariState[],
  dispatch: Dispatch<UnknownAction>,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting,
  onComplete?: () => void,
  prevToastId?: string | number
) => {
  const toastId = prevToastId
    ? prevToastId
    : toast.loading("Memperbaharui data sanggar");
  const changePersonData = (data: any) => ({
    ...data,
    namaSanggar: newSanggar.nama,
  });
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF NAME CHANGED
        if (oldSanggar.nama != newSanggar.nama) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // CHANGE KOREOGRAFER.NAMASANGGAR
        updatePersons(
          koreografers,
          "koreografer",
          changePersonData,
          dispatch,
          () => stepController(3),
          setSubmitting,
          toastId
        );
        break;
      case 3:
        // CHANGE PENARI.NAMASANGGAR
        updatePersons(
          penari,
          "penari",
          changePersonData,
          dispatch,
          () => stepController(4),
          setSubmitting,
          toastId
        );
        break;
      case 4:
        // UPDATE SANGGAR
        toast.loading("Memperbaharui data sanggar", { id: toastId });
        axios
          .patch("/api/sanggars", newSanggar)
          .then((res) => {
            toast.success("Sanggar berhasil diperbaharui", { id: toastId });
            dispatch(updateSanggarRedux(newSanggar));
            dispatch(setSanggarToEditRedux(sanggarInitialValue));
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

// DELETE SANGGAR
export const deleteSanggar = (
  sanggar: SanggarState,
  koreografers: KoreograferState[],
  penaris: PenariState[],
  dispatch: Dispatch<UnknownAction>,
  onComplete?: () => {}
) => {
  const toastId = toast.loading("Menghapus data sanggar");
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE PENARIS
        if (!penaris.length) {
          stepController(2);
          return;
        }
        deletePersons(
          penaris,
          "penari",
          dispatch,
          () => stepController(2),
          toastId
        );
        break;
      case 2:
        // DELETE KOREOGRAFERS
        if (!koreografers.length) {
          stepController(3);
          return;
        }
        deletePersons(
          koreografers,
          "koreografer",
          dispatch,
          () => stepController(3),
          toastId
        );
        break;
      case 3:
        // DELETE SANGGAR
        toast.loading("Menghapus sanggar", { id: toastId });
        axios
          .delete(`/api/sanggars/${sanggar.creatorEmail}/${sanggar.id}`)
          .then((res) => {
            toast.success("Sanggar berhasil dihapus", { id: toastId });
            dispatch(deleteSanggarRedux());
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};
