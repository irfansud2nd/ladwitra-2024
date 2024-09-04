import { SanggarState } from "../sanggar/sanggarConstants";
import { KoreograferState } from "./koreograferConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { getFileUrl, sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnSanggar } from "../sanggar/sanggarFunctions";
import axios from "axios";

export const sendKoreografer = async (
  dataKoreografer: KoreograferState,
  dataSanggar: SanggarState
) => {
  const toastId = toast.loading("Mendaftarkan Koreografer");
  const newDocRef = doc(collection(firestore, "koreografers"));
  const id = newDocRef.id;

  let koreografer: KoreograferState = {
    ...dataKoreografer,
    id,
    waktuPendaftaran: Date.now(),
  };
  let sanggar: SanggarState = dataSanggar;

  const { fotoUrl } = getFileUrl("koreografer", id);

  try {
    if (!koreografer.creatorEmail) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!koreografer.fotoFile) throw { message: "Pas foto tidak ditemukan" };

    // SEND FOTO
    toast.loading("Mengunggah pas foto koreografer", { id: toastId });
    koreografer.downloadFotoUrl = await sendFile(koreografer.fotoFile, fotoUrl);
    delete koreografer.fotoFile;

    // ADD OFFIICAL TO SANGGAR
    toast.loading("Menambahkan koreografer ke sanggar", { id: toastId });
    sanggar = await managePersonOnSanggar(sanggar, koreografer, "add");

    // SEND KOREOGRAFER
    toast.loading("Mendaftarkan koreografer", { id: toastId });
    await axios.post("/api/koreografers", koreografer);
    toast.success("Koreografer berhasil didaftarkan", { id: toastId });
    return { koreografer, sanggar };
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const updateKoreografer = async (
  dataKoreografer: KoreograferState,
  withStatus: boolean = true
) => {
  let koreografer: KoreograferState = { ...dataKoreografer };
  const { fotoUrl } = getFileUrl("koreografer", koreografer.id);
  const toastId = withStatus
    ? toast.loading("Memperbaharui data koreografer")
    : undefined;
  try {
    // UPLOAD NEW PAS FOTO
    if (koreografer.fotoFile) {
      withStatus && toast.loading("Memperbaharui pas foto", { id: toastId });
      koreografer.downloadFotoUrl = await sendFile(
        koreografer.fotoFile,
        fotoUrl
      );
      delete koreografer.fotoFile;
    }

    // UPDATE KOREOGRAFER
    withStatus &&
      toast.loading("Memperbaharui data koreografer", { id: toastId });
    axios.patch("/api/koreografers", koreografer);
    withStatus &&
      toast.success("Koreografer berhasil diperbaharui", { id: toastId });

    return koreografer;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const deleteKoreografer = async (
  dataKoreografer: KoreograferState,
  dataSanggar?: SanggarState
) => {
  const withStatus = dataSanggar ? false : true;
  const toastId = withStatus
    ? toast.loading("Menghapus koreografer")
    : undefined;

  let koreografer: KoreograferState = dataKoreografer;
  let sanggar: SanggarState | undefined = dataSanggar;

  const { fotoUrl } = getFileUrl("koreografer", koreografer.id);

  try {
    // DELETE KOREOGRAFER FROM SANGGAR
    if (dataSanggar) {
      withStatus &&
        toast.loading("Menghapus koreografer dari sanggar", { id: toastId });
      sanggar = await managePersonOnSanggar(dataSanggar, koreografer, "delete");
    }

    // DELETE PAS FOTO
    withStatus &&
      toast.loading("Menghapus pas foto koreografer", { id: toastId });
    await axios.delete(`/api/file?directory=${fotoUrl}`);

    // DELETE KOREOGRAFER
    withStatus && toast.loading("Menghapus koreografer", { id: toastId });
    await axios.delete(
      `/api/koreografers?email=${koreografer.creatorEmail}&id=${koreografer.id}`
    );
    withStatus &&
      toast.success("Koreografer berhasil dihapus", { id: toastId });

    return sanggar;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};
