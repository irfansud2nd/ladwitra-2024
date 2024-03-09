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
import { getBiayaPenari } from "../penari/penariFunctions";

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
    waktuPendaftaran: Date.now(),
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
  personId: string,
  action: "add" | "delete",
  dispatch: Dispatch<UnknownAction>,
  options?: {
    penari?: PenariState;
  }
) => {
  const penari = options?.penari;
  let data: SanggarState = { ...sanggar };
  if (action == "add") data = { ...data, [tipe]: [...sanggar[tipe], personId] };

  if (action == "delete")
    data = {
      ...data,
      [tipe]: [...sanggar[tipe]].filter((item) => item != personId),
    };

  if (penari && action == "delete") {
    data = {
      ...data,
      nomorTarian: data.nomorTarian - penari.nomorTarian,
      tagihan: sanggar.tagihan - getBiayaPenari(penari),
    };
  }

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
  dispatch: Dispatch<UnknownAction>,
  options?: {
    setSubmitting?: SetSubmitting;
    onComplete?: () => void;
    koreografers?: KoreograferState[];
    penaris?: PenariState[];
    prevToastId?: string | number;
  }
) => {
  const koreografers = options?.koreografers;
  const penaris = options?.penaris;
  const setSubmitting = options?.setSubmitting;
  const onComplete = options?.onComplete;
  const prevToastId = options?.prevToastId;

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
        if (!koreografers?.length) {
          stepController(3);
          return;
        }
        updatePersons(koreografers, "koreografer", changePersonData, dispatch, {
          setSubmitting,
          onComplete: () => stepController(3),
          toastId,
        });
        break;
      case 3:
        // CHANGE PENARI.NAMASANGGAR
        if (!penaris?.length) {
          stepController(4);
          return;
        }
        updatePersons(penaris, "penari", changePersonData, dispatch, {
          setSubmitting,
          onComplete: () => stepController(4),
          toastId,
        });
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
