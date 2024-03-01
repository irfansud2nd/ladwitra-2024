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
import { addPaymentRedux } from "../redux/silat/paymentsSlice";
import { PenariState } from "../jaipong/penari/penariConstants";
import { SanggarState } from "../jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "../jaipong/sanggar/sanggarFunctions";

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
  const updatedAtlets = selectedAtlets.map((atlet) => ({
    ...atlet,
    pertandingan: [
      {
        ...atlet.pertandingan[0],
        idPembayaran,
      },
    ],
  }));
  const reducedAtlets = updatedAtlets.reduce((acc, curr: AtletState) => {
    const exist = acc.find((item: AtletState) => item.id == curr.id);
    if (exist) {
      exist.pertandingan = [...exist.pertandingan, curr.pertandingan[0]];
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as AtletState[]);
  const mergedAtlets = reducedAtlets.map((reducedAtlet) => {
    const atlet = allAtlets.find(
      (atlet) => atlet.id == reducedAtlet.id
    ) as AtletState;
    const uniqueEntries: any = {};
    [...atlet?.pertandingan, ...reducedAtlet.pertandingan].forEach((entry) => {
      const key = `${entry.jenis}-${entry.kategori}-${entry.tingkatan}`;
      if (uniqueEntries[key]) {
        if (entry.idPembayaran) {
          uniqueEntries[key] = entry;
        }
      } else {
        uniqueEntries[key] = entry;
      }
    });
    const pertandingan = Object.values(uniqueEntries);
    return { ...atlet, pertandingan } as AtletState;
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
        updateKontingen(
          newKontingen,
          kontingen,
          [],
          mergedAtlets,
          dispatch,
          resetForm,
          setSubmitting,
          () => stepController(2),
          toastId
        );
        break;
      case 2:
        // UPDATE ATLETS
        updatePersons(
          mergedAtlets,
          "atlet",
          (data) => data,
          dispatch,
          () => stepController(3),
          setSubmitting,
          toastId
        );
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
  const updatedPenaris = selectedPenaris.map((penari) => ({
    ...penari,
    tarian: [
      {
        ...penari.tarian[0],
        idPembayaran,
      },
    ],
  }));
  const reducedPenaris = updatedPenaris.reduce((acc, curr: PenariState) => {
    const exist = acc.find((item: PenariState) => item.id == curr.id);
    if (exist) {
      exist.tarian = [...exist.tarian, curr.tarian[0]];
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as PenariState[]);
  const mergedPenaris = reducedPenaris.map((reducedPenari) => {
    const penari = allPenaris.find(
      (penari) => penari.id == reducedPenari.id
    ) as PenariState;
    const uniqueEntries: any = {};
    [...penari?.tarian, ...reducedPenari.tarian].forEach((entry) => {
      const key = `${entry.jenis}-${entry.kelas}-${entry.tingkatan}-${entry.kategori}-${entry.namaTim}`;
      if (uniqueEntries[key]) {
        if (entry.idPembayaran) {
          uniqueEntries[key] = entry;
        }
      } else {
        uniqueEntries[key] = entry;
      }
    });
    const tarian = Object.values(uniqueEntries);
    return { ...penari, tarian } as PenariState;
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
        updateSanggar(
          newSanggar,
          sanggar,
          [],
          mergedPenaris,
          dispatch,
          resetForm,
          setSubmitting,
          () => stepController(2),
          toastId
        );
        break;
      case 2:
        // UPDATE PENARIS
        updatePersons(
          mergedPenaris,
          "penari",
          (data) => data,
          dispatch,
          () => stepController(3),
          setSubmitting,
          toastId
        );
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
  id: string,
  email: string,
  dispatch: Dispatch<UnknownAction>
) => {
  if (!email) {
    toast.error("Session email not found");
    return;
  }
};
