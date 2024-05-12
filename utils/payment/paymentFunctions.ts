import axios from "axios";
import { toast } from "sonner";
import { updateKontingen } from "../silat/kontingen/kontingenFunctions";
import { KontingenState } from "../silat/kontingen/kontingenConstants";
import { AtletState } from "../silat/atlet/atletConstats";
import { getFileUrl, sendFile, updatePersons } from "../form/FormFunctions";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { PaymentState } from "./paymentConstants";
import { formatToRupiah, toastFirebaseError } from "../functions";
import { PenariState } from "../jaipong/penari/penariConstants";
import { SanggarState } from "../jaipong/sanggar/sanggarConstants";
import { updateSanggar } from "../jaipong/sanggar/sanggarFunctions";
import { getPertandinganId } from "../silat/atlet/atletFunctions";
import {
  getPenariLagu,
  getPenariNamaTim,
  getTarianId,
} from "../jaipong/penari/penariFunctions";

export const sendJaipongPayment = async (
  payment: PaymentState,
  selectedPenaris: PenariState[],
  allPenaris: PenariState[],
  sanggar: SanggarState
) => {
  const idPembayaran = doc(collection(firestore, "payments")).id;
  const toastId = toast.loading("Menyimpan pembayaran");
  const { buktiUrl } = getFileUrl("payment", idPembayaran);

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

  let result: {
    penaris: PenariState[];
    sanggar: SanggarState;
    payment: PaymentState;
  } = {
    penaris: updatedPenaris,
    sanggar: sanggar,
    payment: payment,
  };

  try {
    if (!payment.bukti.file) throw { message: "Foto bukti tidak ditemukan" };
    // UPDATE SANGGAR
    result.sanggar.pembayaran = {
      ...result.sanggar.pembayaran,
      ids: [...result.sanggar.pembayaran.ids, idPembayaran],
      total:
        result.sanggar.pembayaran.total +
        Number(formatToRupiah(payment.pembayaran.total, true)),
    };

    result.sanggar = (
      await updateSanggar(result.sanggar, sanggar, { prevToastId: toastId })
    ).sanggar;

    // UPDATE PENARIS
    result.penaris = (await updatePersons(
      updatedPenaris,
      "penari",
      (data) => data,
      toastId
    )) as PenariState[];

    // UPLOAD BUKTI
    toast.loading("Mengunggah bukti pembayaran", { id: toastId });
    result.payment.bukti.downloadUrl = await sendFile(
      payment.bukti.file,
      buktiUrl
    );
    delete result.payment.bukti.file;

    // SEND PAYMANT
    result.payment = {
      ...result.payment,
      id: idPembayaran,
      pembayaran: {
        total: Number(formatToRupiah(result.payment.pembayaran.total, true)),
        waktu: Date.now(),
      },
      source: "jaipong",
    };

    await axios.post(`/api/payments`, result.payment);
    toast.success("Bukti pembayaran berhasil disimpan", {
      id: toastId,
    });

    return result;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const sendSilatPayment = async (
  payment: PaymentState,
  selectedAtlets: AtletState[],
  allAtlets: AtletState[],
  kontingen: KontingenState
) => {
  const idPembayaran = doc(collection(firestore, "payments")).id;
  const toastId = toast.success("Menyimpan pembayaran");
  const { buktiUrl } = getFileUrl("payment", idPembayaran);

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

  let result: {
    atlets: AtletState[];
    kontingen: KontingenState;
    payment: PaymentState;
  } = {
    atlets: updatedAtlets,
    kontingen: kontingen,
    payment: payment,
  };

  try {
    if (!payment.bukti.file) throw { message: "Foto bukti tidak ditemukan" };

    // UPDATE KONTINGEN
    result.kontingen.pembayaran = {
      ...result.kontingen.pembayaran,
      ids: [...result.kontingen.pembayaran.ids, idPembayaran],
      total:
        result.kontingen.pembayaran.total +
        Number(formatToRupiah(payment.pembayaran.total, true)),
    };

    result.kontingen = (
      await updateKontingen(result.kontingen, kontingen, {
        prevToastId: toastId,
      })
    ).kontingen;

    // UPDATE ATLETS
    result.atlets = (await updatePersons(
      updatedAtlets,
      "atlet",
      (data) => data,
      toastId
    )) as AtletState[];

    // UPLOAD BUKTI
    toast.loading("Mengunggah bukti pembayaran", { id: toastId });
    result.payment.bukti.downloadUrl = await sendFile(
      payment.bukti.file,
      buktiUrl
    );
    delete result.payment.bukti.file;

    // SEND PAYMANT
    result.payment = {
      ...result.payment,
      id: idPembayaran,
      pembayaran: {
        total: Number(formatToRupiah(result.payment.pembayaran.total, true)),
        waktu: Date.now(),
      },
      source: "silat",
    };

    await axios.post(`/api/payments`, result.payment);
    toast.success("Bukti pembayaran berhasil disimpan", {
      id: toastId,
    });

    return result;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const deletePayment = async (
  source: "silat" | "jaipong",
  group: KontingenState | SanggarState,
  pesertas: AtletState[] | PenariState[],
  payment: PaymentState
) => {
  const toastId = toast.loading("Menghapus Pembayaran");

  let newGroup: KontingenState | SanggarState = { ...group };
  newGroup.pembayaran.ids = newGroup.pembayaran.ids.filter(
    (idPembayaran) => idPembayaran != payment.id
  );
  newGroup.pembayaran.total =
    newGroup.pembayaran.total - payment.pembayaran.total;

  const changePesertaData = (peserta: AtletState | PenariState) => ({
    ...peserta,
    idPembayaran: [...peserta.idPembayaran].filter(
      (idPembayaran) => idPembayaran != payment.id
    ),
    pembayaran: [...peserta.pembayaran].filter(
      (pembayaran) => pembayaran.idPembayaran != payment.id
    ),
  });

  let newPesertas = pesertas;

  const { buktiUrl } = getFileUrl("payment", payment.id);

  try {
    if (source == "silat") {
      // UPDATE KONTINGEN
      await updateKontingen(
        newGroup as KontingenState,
        group as KontingenState,
        { prevToastId: toastId }
      );
      // UPDATE ATLETS
      newPesertas = (await updatePersons(
        pesertas,
        "atlet",
        changePesertaData as any,
        toastId
      )) as AtletState[];
    } else {
      // UPDATE SANGGAR
      await updateSanggar(newGroup as SanggarState, group as SanggarState, {
        prevToastId: toastId,
      });
      // UPDATE PENARIS
      newPesertas = (await updatePersons(
        pesertas,
        "penari",
        changePesertaData as any,
        toastId
      )) as PenariState[];
    }

    // DELETE FILE BUKTI
    toast.loading("Menghapus bukti pembayaran", { id: toastId });
    await axios.delete(`/api/file?directory=${buktiUrl}`);

    // DELETE PAYMENT
    toast.loading("Menghapus pembayaran", { id: toastId });
    await axios.delete(
      `/api/payments?id=${payment.id}&email=${payment.creatorEmail}`
    );

    toast.success("Pembayaran berhasil dihapus", { id: toastId });
    return { newGroup, newPesertas };
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const confirmPayment = async (
  payment: PaymentState,
  email: string,
  unconfirm: boolean = false
) => {
  const toastId = toast.loading(
    unconfirm ? "Membatalkan konfirmasi" : "Mengkonfirmasi pembayaran"
  );

  try {
    if (!email) throw { message: "creatorEmail tidak ditemukan" };

    const newPayment: PaymentState = {
      ...payment,
      confirmed: {
        state: !unconfirm,
        by: unconfirm ? "" : email,
      },
    };

    await axios.patch("/api/payments", newPayment);
    toast.success("Pembayaran berhasil dikonfirmasi", { id: toastId });
    return newPayment;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};
