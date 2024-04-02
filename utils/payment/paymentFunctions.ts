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
import { PaymentState, paymentInitialValue } from "./paymentConstants";
import { formatToRupiah, toastFirebaseError } from "../functions";
import {
  addPaymentRedux,
  deletePaymentRedux,
  setPaymentToConfirmRedux,
  updatePaymentRedux,
} from "../redux/silat/paymentsSlice";
import { PenariState } from "../jaipong/penari/penariConstants";
import { SanggarState } from "../jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "../jaipong/sanggar/sanggarFunctions";
import { getPertandinganId, updateAtlet } from "../silat/atlet/atletFunctions";
import {
  getPenariLagu,
  getPenariNamaTim,
  getTarianId,
} from "../jaipong/penari/penariFunctions";

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
  const toastId = toast.loading("Menyimpan pembayaran");
  const buktiUrl = `payments/${idPembayaran}`;
  let downloadBuktiUrl = "";

  let updatedPenaris: PenariState[] = [];

  selectedPenaris.map((selectedPenari) => {
    const penariIndex = updatedPenaris.findIndex(
      (updatedPenari) => updatedPenari.id == selectedPenari.id
    );

    const idTarian = getTarianId(selectedPenari.tarian[0], {
      fullId: {
        namaTim: getPenariNamaTim(selectedPenari),
        lagu: getPenariLagu(selectedPenari),
      },
    });

    if (penariIndex < 0) {
      const originalPenari = allPenaris.find(
        (penari) => penari.id == selectedPenari.id
      ) as PenariState;
      updatedPenaris.push({
        ...selectedPenari,
        tarian: originalPenari.tarian,
        pembayaran: [
          ...selectedPenari.pembayaran,
          {
            idPembayaran,
            idTarian,
          },
        ],
        idPembayaran: [...selectedPenari.idPembayaran, idPembayaran],
        namaTim: originalPenari.namaTim,
        lagu: originalPenari.lagu,
      });
    } else {
      updatedPenaris[penariIndex].pembayaran.push({
        idPembayaran,
        idTarian,
      });
    }
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

export const deletePayment = (
  source: "silat" | "jaipong",
  group: KontingenState | SanggarState,
  pesertas: AtletState[] | PenariState[],
  payment: PaymentState,
  setSubmitting: SetSubmitting,
  dispatch: Dispatch<UnknownAction>
) => {
  const toastId = toast.loading("Menghapus Pembayaran");

  let newGroup = { ...group };
  newGroup.idPembayaran = newGroup.idPembayaran.filter(
    (idPembayaran) => idPembayaran != payment.id
  );
  newGroup.totalPembayaran = newGroup.totalPembayaran - payment.totalPembayaran;

  let newPesertas: AtletState[] = [...pesertas] as AtletState[];

  newPesertas = newPesertas.map((newPeserta) => ({
    ...newPeserta,
    idPembayaran: newPeserta.idPembayaran.filter(
      (idPembayaran) => idPembayaran != payment.id
    ),
    pembayaran: newPeserta.pembayaran.filter(
      (pembayaran) => pembayaran.idPembayaran != payment.id
    ),
  }));

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // UPDATE KONTINGEN
        updateKontingen(
          newGroup as KontingenState,
          group as KontingenState,
          dispatch,
          {
            setSubmitting,
            onComplete: () => stepController(3),
            prevToastId: toastId,
          }
        );
        break;
      case 2:
        // UPDATE SANGGAR
        updateSanggar(
          newGroup as SanggarState,
          group as SanggarState,
          dispatch,
          {
            setSubmitting,
            onComplete: () => stepController(4),
            prevToastId: toastId,
          }
        );
        break;
      case 3:
        // UPDATE ATLETS
        updatePersons(newPesertas, "atlet", (data) => data, dispatch, {
          setSubmitting,
          onComplete: () => stepController(5),
          toastId,
        });
        break;
      case 4:
        // UPDATE PENARIS
        updatePersons(newPesertas, "penari", (data) => data, dispatch, {
          setSubmitting,
          onComplete: () => stepController(5),
          toastId,
        });
        break;
      case 5:
        // DELETE FILE BUKTI
        toast.loading("Menghapus bukti pembayaran", { id: toastId });
        axios
          .delete(`/api/file?directory=${payment.buktiUrl}`)
          .then(() => stepController(6))
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
      case 6:
        // DELETE PAYMENT
        // DISPATCH DELETE PAYMENT
        toast.loading("Menghapus pembayaran", { id: toastId });
        axios
          .delete(
            `/api/payments?id=${payment.id}&email=${payment.creatorEmail}`
          )
          .then(() => {
            dispatch(deletePaymentRedux(payment));
            toast.success("Pembayaran berhasil dihapus", { id: toastId });
          })
          .catch((error) => toastFirebaseError(error, toastId))
          .finally(() => setSubmitting(false));
        break;
    }
  };
  stepController(source == "silat" ? 1 : 2);
};

export const confirmPayment = (
  payment: PaymentState,
  email: string,
  dispatch: Dispatch<UnknownAction>,
  unconfirm: boolean = false
) => {
  if (!email) {
    toast.error("Session email not found");
    return;
  }
  const toastId = toast.loading(
    unconfirm ? "Membatalkan konfirmasi" : "Mengkonfirmasi pembayaran"
  );
  const newPayment: PaymentState = {
    ...payment,
    confirmed: !unconfirm,
    confirmedBy: unconfirm ? "" : email,
  };
  return axios
    .patch("/api/payments", newPayment)
    .then(() => {
      dispatch(updatePaymentRedux(newPayment));
      dispatch(setPaymentToConfirmRedux(paymentInitialValue));
      toast.success("Pembayaran berhasil dikonfirmasi", { id: toastId });
    })
    .catch((error) => toastFirebaseError(error, toastId));
};
