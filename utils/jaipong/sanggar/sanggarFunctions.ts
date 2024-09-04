import { collection, doc } from "firebase/firestore";
import { SanggarState } from "./sanggarConstants";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import axios from "axios";

import { PenariState } from "../penari/penariConstants";
import { deletePersons, updatePersons } from "@/utils/form/FormFunctions";
import { KoreograferState } from "../koreografer/koreograferConstants";
import { toastFirebaseError } from "@/utils/functions";
import { getBiayaPenari } from "../penari/penariFunctions";

export const sendSanggar = async (sanggar: SanggarState) => {
  const { id } = doc(collection(firestore, "sanggars"));
  const data: SanggarState = {
    ...sanggar,
    id,
    waktuPendaftaran: Date.now(),
  };

  const toastId = toast.loading("Mendaftarkan Sanggar");

  try {
    await axios.post("/api/sanggars", data);
    toast.success("Sanggar berhasil didaftarkan", { id: toastId });
    return data;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const managePersonOnSanggar = async (
  sanggar: SanggarState,
  person: PenariState | KoreograferState,
  action: "add" | "delete"
) => {
  let penari: PenariState | undefined = undefined;
  let koreografer: KoreograferState | undefined = undefined;

  (person as PenariState).tanggalLahir
    ? (penari = person as PenariState)
    : (koreografer = person as KoreograferState);

  let data: SanggarState = { ...sanggar };
  const property = penari ? "penaris" : "koreografers";
  if (action == "add") data[property] = [...data[property], person.id];

  if (action == "delete")
    data[property] = data[property].filter((item) => item != person.id);

  if (penari && action == "delete") {
    data.nomorTarian -= penari.nomorTarian;
    data.tagihan -= getBiayaPenari(penari);
  }

  try {
    await axios.patch("/api/sanggars", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSanggar = async (
  newSanggar: SanggarState,
  oldSanggar: SanggarState,
  options?: {
    koreografers?: KoreograferState[];
    penaris?: PenariState[];
    prevToastId?: string | number;
  }
) => {
  const toastId =
    options?.prevToastId ?? toast.loading("Memperbaharui sanggar");
  const changePersonSanggarName = (data: any) => ({
    ...data,
    sanggar: { ...data.sanggar, nama: newSanggar.nama },
  });
  let result: {
    penaris: PenariState[];
    koreografers: KoreograferState[];
    sanggar: SanggarState;
  } = {
    penaris: [],
    koreografers: [],
    sanggar: newSanggar,
  };
  try {
    if (oldSanggar.nama != newSanggar.nama) {
      if (options?.penaris) {
        // UPDATE PENARIS
        result.penaris = (await updatePersons(
          options.penaris,
          "penari",
          changePersonSanggarName,
          toastId
        )) as PenariState[];
      }

      if (options?.koreografers) {
        // UPDATE KOREOGRAFERS
        result.koreografers = (await updatePersons(
          options.koreografers,
          "koreografer",
          changePersonSanggarName,
          toastId
        )) as KoreograferState[];
      }
    }

    // UPDATE SANGGAR
    toast.loading("Memperbaharui data sanggar", { id: toastId });
    await axios.patch("/api/sanggars", newSanggar);
    toast.success("Sanggar berhasil diperbaharui", { id: toastId });
    return result;
  } catch (error) {
    toastFirebaseError(error);
    throw error;
  }
};

export const deleteSanggar = async (
  sanggar: SanggarState,
  koreografers: KoreograferState[],
  penaris: PenariState[]
) => {
  const toastId = toast.loading("Menghapus data sanggar");
  try {
    // DELETE PENARI
    await deletePersons(penaris, "penari", toastId);

    // DELETE KOREOGRAFER
    await deletePersons(koreografers, "koreografer", toastId);

    // DELETE SANGGAR
    toast.loading("Menghapus sanggar", { id: toastId });
    await axios.delete(
      `/api/sanggars?email=${sanggar.creatorEmail}&id=${sanggar.id}`
    );

    toast.success("Sanggar berhasil dihapus", { id: toastId });
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};
