import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { KontingenState } from "../kontingen/kontingenConstants";
import { OfficialState } from "./officialConstants";
import { SetSubmitting } from "@/utils/form/FormConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";
import axios from "axios";
import {
  addOfficialRedux,
  deleteOfficialRedux,
  updateOfficialRedux,
} from "@/utils/redux/silat/officialsSlice";

// SEND OFFICIAL
export const sendOfficial = (
  official: OfficialState,
  kontingen: KontingenState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  resetForm: () => void
) => {
  if (!official.creatorEmail) {
    toast.error("Creator Email not found !");
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "officials"));
  const id = newDocRef.id;
  const fotoUrl = `officials/pasFoto/${id}`;
  let downloadFotoUrl = "";
  const toastId = toast.loading("Mendaftarkan official");

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        toast.loading("Mengunggah pas foto official", { id: toastId });
        official.fotoFile &&
          sendFile(official.fotoFile, fotoUrl)
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
        // ADD OFFICIAL TO KONTINGEN IF EVENT ID
        toast.loading("Menambahkan official ke kontingen", { id: toastId });
        managePersonOnKontingen(kontingen, "officials", id, "add", dispatch)
          .then(() => {
            stepController(3);
          })
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // SEND OFFICIAL
        toast.loading("Mendaftarkan official", { id: toastId });

        delete official.fotoFile;
        const data: OfficialState = {
          ...official,
          id,
          fotoUrl,
          downloadFotoUrl,
          waktuPendaftaran: Date.now(),
        };

        axios
          .post("/api/officials", data)
          .then((res) => {
            toast.success("Official berhasil didaftarkan", { id: toastId });
            dispatch(addOfficialRedux(data));
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
export const updateOfficial = (
  official: OfficialState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus
    ? toast.loading("Memperbaharui data official")
    : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF PAS FOTO CHANGED
        if (official.fotoFile) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE OLD PAS FOTO
        withStatus && toast.loading("Menghapus pas foto lama", { id: toastId });
        axios
          .delete(`/api/file/${official.fotoUrl}`)
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
        official.fotoFile &&
          sendFile(official.fotoFile, official.fotoUrl)
            .then((url) => {
              official.downloadFotoUrl = url;
              stepController(4);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 4:
        // UPDATE OFFICIAL
        withStatus &&
          toast.loading("Memperbaharui data official", { id: toastId });
        official.fotoFile && delete official.fotoFile;

        axios
          .patch("/api/officials", official)
          .then((res) => {
            dispatch(updateOfficialRedux(official));
            withStatus &&
              toast.success("Official berhasil diperbaharui", { id: toastId });
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

// DELETE OFFICIAL
export const deleteOfficial = (
  official: OfficialState,
  dispatch: Dispatch<UnknownAction>,
  kontingen?: KontingenState,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus ? toast.loading("Menghapus official") : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE FROM KONTINGEN
        if (!kontingen) {
          stepController(2);
          return;
        }
        withStatus &&
          toast.loading("Menghapus official dari kontingen", { id: toastId });
        managePersonOnKontingen(
          kontingen,
          "officials",
          official.id,
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
          toast.loading("Menghapus pas foto official", { id: toastId });
        axios
          .delete(`/api/file/${official.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // DELETE OFFICIAL
        withStatus && toast.loading("Menghapus official", { id: toastId });
        axios
          .delete(`/api/officials/${official.creatorEmail}/${official.id}`)
          .then((res) => {
            withStatus &&
              toast.success("Official berhasil dihapus", { id: toastId });
            dispatch(deleteOfficialRedux(official));
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
};
