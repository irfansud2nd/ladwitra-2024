import axios from "axios";
import { toast } from "sonner";
import { updateKontingen } from "../silat/kontingen/kontingenFunctions";
import { KontingenState } from "../silat/kontingen/kontingenConstants";
import { AtletState } from "../silat/atlet/atletConstats";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { ResetForm, SetSubmitting } from "../form/FormConstants";
import { sendFile, updatePersons } from "../form/FormFunctions";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { PaymentState } from "./paymentConstants";
import { formatToRupiah, toastFirebaseError } from "../functions";
import {
  addPaymentRedux,
  updatePaymentRedux,
} from "../redux/silat/paymentsSlice";
import { PenariState } from "../jaipong/penari/penariConstants";
import { SanggarState } from "../jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "../jaipong/sanggar/sanggarFunctions";
import { getPertandinganId, updateAtlet } from "../silat/atlet/atletFunctions";
import { getTarianId } from "../jaipong/penari/penariFunctions";

export const sendSilatPayment = (
  payment: PaymentState,
  selectedAtlets: AtletState[],
  allAtlets: AtletState[],
  kontingen: KontingenState,
  dispatch: Dispatch<UnknownAction>,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting
) => {
  const idPembayaran = doc(collection(firestore, "atlets")).id;
  const toastId = toast.success("Menyimpan pembayaran");
  const buktiUrl = `payments/${idPembayaran}`;
  let downloadBuktiUrl = "";

  let updatedAtlets: AtletState[] = [];

  selectedAtlets.map((selectedAtlet) => {
    const atletIndex = updatedAtlets.findIndex(
      (updatedAtlet) => updatedAtlet.id == selectedAtlet.id
    );
    if (atletIndex < 0) {
      const allPertandingan = allAtlets.find(
        (atlet) => atlet.id == selectedAtlet.id
      )?.pertandingan as [];
      updatedAtlets.push({
        ...selectedAtlet,
        pertandingan: allPertandingan,
        pembayaran: [
          ...selectedAtlet.pembayaran,
          {
            idPembayaran,
            idPertandingan: getPertandinganId(selectedAtlet.pertandingan[0]),
          },
        ],
        idPembayaran: [...selectedAtlet.idPembayaran, idPembayaran],
      });
    } else {
      updatedAtlets[atletIndex].pembayaran.push({
        idPembayaran,
        idPertandingan: getPertandinganId(selectedAtlet.pertandingan[0]),
      });
      updatedAtlets[atletIndex].idPembayaran.push(idPembayaran);
    }
  });

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // UPDATE KONTINGEN
        const newKontingen: KontingenState = {
          ...kontingen,
          idPembayaran: [...kontingen.idPembayaran, idPembayaran],
          totalPembayaran:
            kontingen.totalPembayaran +
            Number(formatToRupiah(payment.totalPembayaran, true)),
        };
        updateKontingen(newKontingen, kontingen, dispatch, {
          setSubmitting,
          onComplete: () => stepController(2),
          atlets: updatedAtlets,
          prevToastId: toastId,
        });
        break;
      case 2:
        // UPDATE ATLETS
        updatePersons(updatedAtlets, "atlet", (data) => data, dispatch, {
          setSubmitting,
          onComplete: () => stepController(3),
          toastId,
        });
        break;
      case 3:
        // UPLOAD BUKTI PAYMENT
        if (!payment.buktiFile) return;
        toast.loading("Mengunggah bukti pembayaran", { id: toastId });
        sendFile(payment.buktiFile, buktiUrl)
          .then((url) => {
            downloadBuktiUrl = url;
            stepController(4);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        toast.loading("Menyimpan pembayaran", { id: toastId });
        delete payment.buktiFile;
        const data: PaymentState = {
          ...payment,
          id: idPembayaran,
          downloadBuktiUrl,
          buktiUrl,
          totalPembayaran: Number(
            formatToRupiah(payment.totalPembayaran, true)
          ),
          waktuPembayaran: Date.now(),
          source: "silat",
        };
        axios
          .post(`/api/payments`, data)
          .then(() => {
            toast.success("Bukti pembayaran berhasil disimpan", {
              id: toastId,
            });
            dispatch(addPaymentRedux(data));
            resetForm();
            setSubmitting(false);
          })
          .catch((error) => {
            toastFirebaseError(error, toastId);
            setSubmitting(false);
          });
        break;
    }
  };
  stepController(1);
};

export const sendJaipongPayment = (
  payment: PaymentState,
  selectedPenaris: PenariState[],
  allPenaris: PenariState[],
  sanggar: SanggarState,
  dispatch: Dispatch<UnknownAction>,
  resetForm: ResetForm,
  setSubmitting: SetSubmitting
) => {
  const idPembayaran = doc(collection(firestore, "penaris")).id;
  const toastId = toast.success("Menyimpan pembayaran");
  const buktiUrl = `payments/${idPembayaran}`;
  let downloadBuktiUrl = "";

  let updatedPenaris: PenariState[] = [];

  selectedPenaris.map((selectedPenari) => {
    const penariIndex = updatedPenaris.findIndex(
      (updatedPenari) => updatedPenari.id == selectedPenari.id
    );
    if (penariIndex < 0) {
      const allTarian = allPenaris.find(
        (penari) => penari.id == selectedPenari.id
      )?.tarian as [];
      updatedPenaris.push({
        ...selectedPenari,
        tarian: allTarian,
        pembayaran: [
          ...selectedPenari.pembayaran,
          {
            idPembayaran,
            idTarian: getTarianId(selectedPenari.tarian[0], {
              fullId: {
                namaTim: selectedPenari.namaTim[0].namaTim,
                lagu: selectedPenari.lagu[0].lagu,
              },
            }),
          },
        ],
        idPembayaran: [...selectedPenari.idPembayaran, idPembayaran],
      });
    } else {
      updatedPenaris[penariIndex].pembayaran.push({
        idPembayaran,
        idTarian: getTarianId(selectedPenari.tarian[0]),
      });
    }
    updatedPenaris[penariIndex].idPembayaran.push(idPembayaran);
  });

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // UPDATE SANGGAR
        const newSanggar: SanggarState = {
          ...sanggar,
          idPembayaran: [...sanggar.idPembayaran, idPembayaran],
          totalPembayaran:
            sanggar.totalPembayaran +
            Number(formatToRupiah(payment.totalPembayaran, true)),
        };
        updateSanggar(newSanggar, sanggar, dispatch, {
          setSubmitting,
          onComplete: () => stepController(2),
          penaris: updatedPenaris,
          prevToastId: toastId,
        });
        break;
      case 2:
        // UPDATE PENARIS
        updatePersons(updatedPenaris, "penari", (data) => data, dispatch, {
          setSubmitting,
          onComplete: () => stepController(3),
          toastId,
        });
        break;
      case 3:
        // UPLOAD BUKTI PAYMENT
        if (!payment.buktiFile) return;
        toast.loading("Mengunggah bukti pembayaran", { id: toastId });
        sendFile(payment.buktiFile, buktiUrl)
          .then((url) => {
            downloadBuktiUrl = url;
            stepController(4);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        toast.loading("Menyimpan pembayaran", { id: toastId });
        delete payment.buktiFile;
        const data: PaymentState = {
          ...payment,
          id: idPembayaran,
          downloadBuktiUrl,
          buktiUrl,
          totalPembayaran: Number(
            formatToRupiah(payment.totalPembayaran, true)
          ),
          waktuPembayaran: Date.now(),
          source: "jaipong",
        };
        axios
          .post(`/api/payments`, data)
          .then(() => {
            toast.success("Bukti pembayaran berhasil disimpan", {
              id: toastId,
            });
            dispatch(addPaymentRedux(data));
            resetForm();
            setSubmitting(false);
          })
          .catch((error) => {
            toastFirebaseError(error, toastId);
            setSubmitting(false);
          });
        break;
    }
  };
  stepController(1);
};

export const confirmPayment = (
  payment: PaymentState,
  email: string,
  dispatch: Dispatch<UnknownAction>
) => {
  if (!email) {
    toast.error("Session email not found");
    return;
  }
  const toastId = toast.loading("Mengkonfirmasi pembayaran");
  const newPayment: PaymentState = {
    ...payment,
    confirmed: true,
    confirmedBy: email,
  };
  return axios
    .patch("/api/payments", newPayment)
    .then(() => {
      dispatch(updatePaymentRedux(newPayment));
      toast.success("Pembayaran berhasil dikonfirmasi", { id: toastId });
    })
    .catch((error) => toastFirebaseError(error, toastId));
};
