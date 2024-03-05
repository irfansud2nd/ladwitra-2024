import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { SanggarState } from "../sanggar/sanggarConstants";
import { KoreograferState } from "./koreograferConstants";
import { SetSubmitting } from "@/utils/form/FormConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnSanggar } from "../sanggar/sanggarFunctions";
import axios from "axios";
import {
  addKoreograferRedux,
  deleteKoreograferRedux,
  updateKoreograferRedux,
} from "@/utils/redux/jaipong/koreografersSlice";

// SEND KOREOGRAFER
export const sendKoreografer = (
  koreografer: KoreograferState,
  sanggar: SanggarState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  resetForm: () => void
) => {
  if (!koreografer.creatorEmail) {
    toast.error("Creator Email not found !");
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "koreografers"));
  const id = newDocRef.id;
  const fotoUrl = `koreografers/pasFoto/${id}`;
  let downloadFotoUrl = "";
  const toastId = toast.loading("Mendaftarkan koreografer");

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        toast.loading("Mengunggah pas foto koreografer", { id: toastId });
        koreografer.fotoFile &&
          sendFile(koreografer.fotoFile, fotoUrl)
            .then((url) => {
              downloadFotoUrl = url;
              stepController(2);
            })
            .catch((error) => {
              setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 2:
        // ADD KOREOGRAFER TO SANGGAR IF EVENT ID
        toast.loading("Menambahkan koreografer ke sanggar", { id: toastId });
        managePersonOnSanggar(sanggar, "koreografers", id, "add", dispatch)
          .then(() => {
            stepController(3);
          })
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // SEND KOREOGRAFER
        toast.loading("Mendaftarkan koreografer", { id: toastId });

        delete koreografer.fotoFile;
        const data: KoreograferState = {
          ...koreografer,
          id,
          fotoUrl,
          downloadFotoUrl,
          waktuPendaftaran: Date.now(),
        };

        axios
          .post("/api/koreografers", data)
          .then((res) => {
            toast.success("Koreografer berhasil didaftarkan", { id: toastId });
            dispatch(addKoreograferRedux(data));
            setSubmitting(false);
            resetForm();
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
    }
  };
  stepController(1);
};

// UPDATE OFFFICIAL
export const updateKoreografer = (
  koreografer: KoreograferState,
  dispatch: Dispatch<UnknownAction>,
  options?: {
    setSubmitting?: SetSubmitting;
    onComplete?: () => void;
    withoutStatus?: boolean;
  }
) => {
  const setSubmitting = options?.setSubmitting;
  const onComplete = options?.onComplete;
  const withoutStatus = options?.withoutStatus || false;

  const toastId = withoutStatus
    ? undefined
    : toast.loading("Memperbaharui data official");

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF PAS FOTO CHANGED
        if (koreografer.fotoFile) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE OLD PAS FOTO
        !withoutStatus &&
          toast.loading("Menghapus pas foto lama", { id: toastId });
        axios
          .delete(`/api/file/${koreografer.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // UPLOAD NEW PAS FOTO
        !withoutStatus &&
          toast.loading("Mengunggah pas foto baru", { id: toastId });
        koreografer.fotoFile &&
          sendFile(koreografer.fotoFile, koreografer.fotoUrl)
            .then((url) => {
              koreografer.downloadFotoUrl = url;
              stepController(4);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 4:
        // UPDATE KOREOGRAFER
        !withoutStatus &&
          toast.loading("Memperbaharui data official", { id: toastId });
        koreografer.fotoFile && delete koreografer.fotoFile;

        axios
          .patch("/api/koreografers", koreografer)
          .then((res) => {
            dispatch(updateKoreograferRedux(koreografer));
            !withoutStatus &&
              toast.success("Official berhasil diperbaharui", {
                id: toastId,
              });
            onComplete && onComplete();
            setSubmitting && setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
    }
  };
  stepController(1);
};

// DELETE KOREOGRAFER
export const deleteKoreografer = (
  koreografer: KoreograferState,
  dispatch: Dispatch<UnknownAction>,
  sanggar?: SanggarState,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus
    ? toast.loading("Menghapus koreografer")
    : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE FROM SANGGAR
        if (!sanggar) {
          stepController(2);
          return;
        }
        withStatus &&
          toast.loading("Menghapus koreografer dari sanggar", { id: toastId });
        managePersonOnSanggar(
          sanggar,
          "koreografers",
          koreografer.id,
          "delete",
          dispatch
        )
          .then((s) => {
            stepController(2);
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
      case 2:
        // DELETE PAS FOTO
        withStatus &&
          toast.loading("Menghapus pas foto koreografer", { id: toastId });
        axios
          .delete(`/api/file/${koreografer.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // DELETE KOREOGRAFER
        withStatus && toast.loading("Menghapus koreografer", { id: toastId });
        axios
          .delete(
            `/api/koreografers/${koreografer.creatorEmail}/${koreografer.id}`
          )
          .then((res) => {
            withStatus &&
              toast.success("Koreografer berhasil dihapus", { id: toastId });
            dispatch(deleteKoreograferRedux(koreografer));
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};
