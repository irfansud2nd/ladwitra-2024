import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { SanggarState } from "../sanggar/sanggarConstants";
import { PenariState, tingkatanKategoriJaipong } from "./penariConstants";
import { SetSubmitting } from "@/utils/form/FormConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnSanggar } from "../sanggar/sanggarFunctions";
import axios from "axios";
import {
  addPenariRedux,
  deletePenariRedux,
  updatePenariRedux,
} from "@/utils/redux/jaipong/penarisSlice";

// SELECT DEFAULT CATEGORY
export const selectCategoryJaipong = (tingkatan: string) => {
  return tingkatanKategoriJaipong.find((item) => item.tingkatan == tingkatan)
    ?.kategori as string[];
};

// SEND PENARI
export const sendPenari = (
  penari: PenariState,
  sanggar: SanggarState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  resetForm: () => void
) => {
  if (!penari.creatorEmail) {
    toast.error("Creator Email not found !");
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "penaris"));
  const id = newDocRef.id;
  const fotoUrl = `penaris/pasFoto/${id}`;
  const kkUrl = `penaris/kk/${id}`;
  const ktpUrl = `penaris/ktp/${id}`;
  let downloadFotoUrl = "";
  let downloadKtpUrl = "";
  let downloadKkUrl = "";
  const toastId = toast.loading("Mendaftarkan penari");

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        toast.loading("Mengunggah pas foto penari", { id: toastId });
        if (!penari.fotoFile) return;
        sendFile(penari.fotoFile, fotoUrl)
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
        // SEND KTP
        toast.loading("Mengunggah KTP penari", { id: toastId });
        if (!penari.ktpFile) return;
        sendFile(penari.ktpFile, ktpUrl)
          .then((url) => {
            downloadKtpUrl = url;
            stepController(3);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // SEND KK
        toast.loading("Mengunggah KK penari", { id: toastId });
        if (!penari.kkFile) return;
        sendFile(penari.kkFile, kkUrl)
          .then((url) => {
            downloadKkUrl = url;
            stepController(4);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        // ADD PENARI TO SANGGAR
        toast.loading("Menambahkan penari ke sanggar", { id: toastId });
        managePersonOnSanggar(sanggar, "penaris", id, "add", dispatch)
          .then(() => {
            stepController(5);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 5:
        // SEND PENARI
        toast.loading("Mendaftarkan penari", { id: toastId });
        delete penari.fotoFile;
        delete penari.kkFile;
        delete penari.ktpFile;
        const dataPenari: PenariState = {
          ...penari,
          id,
          fotoUrl,
          downloadFotoUrl,
          ktpUrl,
          downloadKtpUrl,
          kkUrl,
          downloadKkUrl,
          waktuPendaftaran: Date.now(),
        };

        axios
          .post("/api/penaris", dataPenari)
          .then((res) => {
            toast.success("Penari berhasil didaftarkan", { id: toastId });
            dispatch(addPenariRedux(dataPenari));
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

// UPDATE PENARI
export const updatePenari = (
  penari: PenariState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus
    ? toast.loading("Memperbaharui data penari")
    : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF PAS FOTO CHANGED
        if (penari.fotoFile) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE OLD PAS FOTO
        withStatus && toast.loading("Menghapus pas foto lama", { id: toastId });
        axios
          .delete(`/api/file/${penari.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // UPLOAD NEW PAS FOTO
        withStatus &&
          toast.loading("Mengunggah pas foto baru", { id: toastId });
        penari.fotoFile &&
          sendFile(penari.fotoFile, penari.fotoUrl)
            .then((url) => {
              penari.downloadFotoUrl = url;
              stepController(4);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 4:
        // CHECK IF KTP CHANGED
        if (penari.ktpFile) {
          stepController(5);
        } else {
          stepController(7);
        }
        break;
      case 5:
        // DELETE OLD KTP
        withStatus && toast.loading("Menghapus KTP lama", { id: toastId });
        axios
          .delete(`/api/file/${penari.ktpUrl}`)
          .then(() => stepController(6))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 6:
        // UPLOAD NEW KTP
        withStatus && toast.loading("Mengunggah KTP baru", { id: toastId });
        penari.ktpFile &&
          sendFile(penari.ktpFile, penari.ktpUrl)
            .then((url) => {
              penari.downloadKtpUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 7:
        // CHECK IF KK CHANGED
        if (penari.kkFile) {
          stepController(8);
        } else {
          stepController(10);
        }
        break;
      case 8:
        // DELETE OLD KK
        withStatus && toast.loading("Menghapus KK lama", { id: toastId });
        axios
          .delete(`/api/file/${penari.kkUrl}`)
          .then(() => stepController(9))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 9:
        // UPLOAD NEW KK
        withStatus && toast.loading("Mengunggah KK baru", { id: toastId });
        penari.kkFile &&
          sendFile(penari.kkFile, penari.kkUrl)
            .then((url) => {
              penari.downloadKkUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 10:
        // UPDATE PENARI
        withStatus &&
          toast.loading("Memperbaharui data penari", { id: toastId });
        penari.fotoFile && delete penari.fotoFile;
        penari.ktpFile && delete penari.ktpFile;
        penari.kkFile && delete penari.kkFile;

        axios
          .patch("/api/penaris", penari)
          .then((res) => {
            dispatch(updatePenariRedux(penari));
            withStatus &&
              toast.success("Penari berhasil diperbaharui", { id: toastId });
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

// DELETE PENARI
export const deletePenari = (
  penari: PenariState,
  dispatch: Dispatch<UnknownAction>,
  sanggar?: SanggarState,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus ? toast.loading("Menghapus penari") : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE PENARI FROM SANGGAR
        if (!sanggar) {
          stepController(2);
          return;
        }
        withStatus &&
          toast.loading("Menghapus penari dari sanggar", { id: toastId });
        managePersonOnSanggar(sanggar, "penaris", penari.id, "delete", dispatch)
          .then(() => {
            stepController(2);
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
      case 2:
        // DELETE PAS FOTO
        withStatus &&
          toast.loading("Menghapus pas foto penari", { id: toastId });
        axios
          .delete(`/api/file/${penari.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // DELETE KTP
        withStatus && toast.loading("Menghapus KTP penari", { id: toastId });
        axios
          .delete(`/api/file/${penari.ktpUrl}`)
          .then(() => stepController(4))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        // DELETE KK
        withStatus && toast.loading("Menghapus kk penari", { id: toastId });
        axios
          .delete(`/api/file/${penari.kkUrl}`)
          .then(() => stepController(5))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 5:
        // DELETE PENARI
        withStatus && toast.loading("Menghapus penari", { id: toastId });
        axios
          .delete(`/api/penaris/${penari.creatorEmail}/${penari.id}`)
          .then((res) => {
            withStatus &&
              toast.success("Penari berhasil dihapus", { id: toastId });
            dispatch(deletePenariRedux(penari));
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};

export const getBiayaPenaris = (penaris: PenariState[]) => {
  let total = 0;
  penaris.map((penari: PenariState) => {
    penari.tarian[0].jenis == "Tunggal" ? (total += 200000) : (total += 350000);
  });
  return total;
};
