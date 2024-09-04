import { KontingenState } from "../kontingen/kontingenConstants";
import { OfficialState } from "./officialConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { getFileUrl, sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";
import axios from "axios";

export const sendOfficial = async (
  dataOfficial: OfficialState,
  dataKontingen: KontingenState
) => {
  const toastId = toast.loading("Mendaftarkan Official");
  const newDocRef = doc(collection(firestore, "officials"));
  const id = newDocRef.id;

  let official: OfficialState = {
    ...dataOfficial,
    id,
    waktuPendaftaran: Date.now(),
  };
  let kontingen: KontingenState = dataKontingen;

  const { fotoUrl } = getFileUrl("official", id);

  try {
    if (!official.creatorEmail) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!official.fotoFile) throw { message: "Pas foto tidak ditemukan" };

    // SEND FOTO
    toast.loading("Mengunggah pas foto official", { id: toastId });
    official.downloadFotoUrl = await sendFile(official.fotoFile, fotoUrl);
    delete official.fotoFile;

    // ADD OFFIICAL TO KONTINGEN
    toast.loading("Menambahkan official ke kontingen", { id: toastId });
    kontingen = await managePersonOnKontingen(kontingen, official, "add");

    // SEND OFFICIAL
    toast.loading("Mendaftarkan official", { id: toastId });
    await axios.post("/api/officials", official);
    toast.success("Official berhasil didaftarkan", { id: toastId });
    return { official, kontingen };
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const updateOfficial = async (
  dataOfficial: OfficialState,
  withStatus: boolean = true
) => {
  let official: OfficialState = { ...dataOfficial };
  const { fotoUrl } = getFileUrl("official", official.id);
  const toastId = withStatus
    ? toast.loading("Memperbaharui data official")
    : undefined;
  try {
    // UPLOAD NEW PAS FOTO
    if (official.fotoFile) {
      withStatus && toast.loading("Memperbaharui pas foto", { id: toastId });
      official.downloadFotoUrl = await sendFile(official.fotoFile, fotoUrl);
      delete official.fotoFile;
    }

    // UPDATE OFFICIAL
    withStatus && toast.loading("Memperbaharui data official", { id: toastId });
    axios.patch("/api/officials", official);
    withStatus &&
      toast.success("Official berhasil diperbaharui", { id: toastId });

    return official;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const deleteOfficial = async (
  dataOfficial: OfficialState,
  dataKontingen?: KontingenState
) => {
  const withStatus = !!dataKontingen;
  const toastId = withStatus ? toast.loading("Menghapus official") : undefined;

  let official: OfficialState = dataOfficial;
  let kontingen: KontingenState | undefined = dataKontingen;

  const { fotoUrl } = getFileUrl("official", official.id);

  try {
    // DELETE OFFICIAL FROM KONTINGEN
    if (dataKontingen) {
      withStatus &&
        toast.loading("Menghapus official dari kontingen", { id: toastId });
      kontingen = await managePersonOnKontingen(
        dataKontingen,
        official,
        "delete"
      );
    }

    // DELETE PAS FOTO
    withStatus && toast.loading("Menghapus pas foto official", { id: toastId });
    await axios.delete(`/api/file?directory=${fotoUrl}`);

    // DELETE OFFICIAL
    withStatus && toast.loading("Menghapus official", { id: toastId });
    await axios.delete(
      `/api/officials?email=${official.creatorEmail}&id=${official.id}`
    );
    withStatus && toast.success("Official berhasil dihapus", { id: toastId });

    return kontingen;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};
