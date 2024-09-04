import { firestore } from "@/lib/firebase";
import { KontingenState } from "@/utils/silat/kontingen/kontingenConstants";
import axios from "axios";
import { collection, doc } from "firebase/firestore";
import { toast } from "sonner";
import { OfficialState } from "../official/officialConstants";
import { AtletState, biayaAtlet } from "../atlet/atletConstants";
import { updatePersons, deletePersons } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";

export const sendKontingen = async (kontingen: KontingenState) => {
  const { id } = doc(collection(firestore, "kontingens"));
  const data: KontingenState = {
    ...kontingen,
    id,
    waktuPendaftaran: Date.now(),
  };

  const toastId = toast.loading("Mendaftarkan Kontingen");

  try {
    await axios.post("/api/kontingens", data);
    toast.success("Kontingen berhasil didaftarkan", { id: toastId });
    return data;
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const managePersonOnKontingen = async (
  kontingen: KontingenState,
  person: AtletState | OfficialState,
  action: "add" | "delete"
) => {
  let atlet: AtletState | undefined = undefined;
  let official: OfficialState | undefined = undefined;

  (person as AtletState).tanggalLahir
    ? (atlet = person as AtletState)
    : (official = person as OfficialState);

  let data: KontingenState = { ...kontingen };
  const property = atlet ? "atlets" : "officials";
  if (action == "add") data[property] = [...data[property], person.id];
  if (action == "delete")
    data[property] = data[property].filter((item) => item != person.id);

  if (atlet && action == "delete") {
    data.nomorPertandingan -= atlet.nomorPertandingan;
    data.tagihan -= atlet.nomorPertandingan * biayaAtlet;
  }

  try {
    await axios.patch("/api/kontingens", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateKontingen = async (
  newKontingen: KontingenState,
  oldKontingen: KontingenState,
  options?: {
    officials?: OfficialState[];
    atlets?: AtletState[];
    prevToastId?: string | number;
  }
) => {
  const toastId =
    options?.prevToastId ?? toast.loading("Memperbaharui kontingen");
  const changePersonKontingenName = (data: any) => ({
    ...data,
    kontingen: { ...data.kontingen, nama: newKontingen.nama },
  });

  let result: {
    atlets: AtletState[];
    officials: OfficialState[];
    kontingen: KontingenState;
  } = {
    atlets: [],
    officials: [],
    kontingen: newKontingen,
  };

  try {
    if (oldKontingen.nama != newKontingen.nama) {
      if (options?.atlets) {
        // UPDATE ATLETS
        result.atlets = (await updatePersons(
          options.atlets,
          "atlet",
          changePersonKontingenName,
          toastId
        )) as AtletState[];
      }

      if (options?.officials) {
        // UPDATE OFFICIALS
        result.officials = (await updatePersons(
          options.officials,
          "official",
          changePersonKontingenName,
          toastId
        )) as OfficialState[];
      }
    }

    // UPDATE KONTINGEN
    toast.loading("Memperbaharui data kontingen", { id: toastId });
    await axios.patch("/api/kontingens", newKontingen);

    toast.success("Kontingen berhasil diperbaharui", { id: toastId });
    return result;
  } catch (error) {
    toastFirebaseError(error);
    throw error;
  }
};

export const deleteKontingen = async (
  kontingen: KontingenState,
  officials: OfficialState[],
  atlets: AtletState[]
) => {
  const toastId = toast.loading("Menghapus data kontingen");
  try {
    // DELETE ATLET
    await deletePersons(atlets, "atlet", toastId);

    // DELETE OFFICIAL
    await deletePersons(officials, "official", toastId);

    // DELETE KONTINGEN
    toast.loading("Menghapus kontingen", { id: toastId });
    await axios.delete(
      `/api/kontingens?email=${kontingen.creatorEmail}&id=${kontingen.id}`
    );

    toast.success("Kontingen berhasil dihapus", { id: toastId });
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};
