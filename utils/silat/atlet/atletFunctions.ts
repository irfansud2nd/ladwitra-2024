import axios from "axios";
import {
  AtletState,
  jenisPertandingan,
  tingkatanKategoriSilat,
} from "./atletConstats";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { getFileUrl, sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { KontingenState } from "../kontingen/kontingenConstants";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";

export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

export const selectCategorySilat = (
  tingkatan: string,
  jenis: string,
  jenisKelamin: string
) => {
  if (jenis == jenisPertandingan[0]) {
    return tingkatanKategoriSilat[
      tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
    ].kategoriTanding;
  } else {
    return tingkatanKategoriSilat[
      tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
    ].kategoriSeni;

    // if (jenisKelamin == jenisKelaminPeserta[0]) {
    //   return tingkatanKategoriSilat[
    //     tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
    //   ].kategoriSeni.putra;
    // } else {
    //   return tingkatanKategoriSilat[
    //     tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
    //   ].kategoriSeni.putri;
    // }
  }
};

export const sendAtlet = async (
  dataAtlet: AtletState,
  dataKontingen: KontingenState
) => {
  const toastId = toast.loading("Mendaftarkan Atlet");
  const newDocRef = doc(collection(firestore, "atlets"));
  const id = newDocRef.id;

  let atlet: AtletState = { ...dataAtlet, id, waktuPendaftaran: Date.now() };
  let kontingen: KontingenState = dataKontingen;

  const { fotoUrl, ktpUrl, kkUrl } = getFileUrl("atlet", id);

  try {
    if (!atlet.creatorEmail) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!atlet.foto.file) throw { message: "Pas foto tidak ditemukan" };
    if (!atlet.ktp.file) throw { message: "KTP tidak ditemukan" };
    if (!atlet.kk.file) throw { message: "KK tidak ditemukan" };

    // SEND FOTO
    toast.loading("Mengunggah pas foto atlet", { id: toastId });
    atlet.foto.downloadUrl = await sendFile(atlet.foto.file, fotoUrl);
    delete atlet.foto.file;

    // SEND KTP
    toast.loading("Mengunggah KTP", { id: toastId });
    atlet.ktp.downloadUrl = await sendFile(atlet.ktp.file, ktpUrl);
    delete atlet.ktp.file;

    // SEND KK
    toast.loading("Mengunggah KK", { id: toastId });
    atlet.kk.downloadUrl = await sendFile(atlet.kk.file, kkUrl);
    delete atlet.ktp.file;

    // ADD ATLET TO KONTINGEN
    toast.loading("Menambahkan atlet ke kontingen", { id: toastId });
    kontingen = await managePersonOnKontingen(kontingen, atlet, "add");

    // SEND ATLET
    toast.loading("Mendaftarkan atlet", { id: toastId });
    await axios.post("/api/atlets", atlet);
    toast.success("Atlet berhasil didaftarkan", { id: toastId });
    return { kontingen, atlet };
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const updateAtlet = async (
  dataAtlet: AtletState,
  withStatus: boolean = true
) => {
  let atlet: AtletState = { ...dataAtlet };
  const { fotoUrl, ktpUrl, kkUrl } = getFileUrl("atlet", atlet.id);
  const toastId = withStatus
    ? toast.loading("Memperbaharui data atlet")
    : undefined;
  try {
    // UPLOAD NEW PAS FOTO
    if (atlet.foto.file) {
      withStatus && toast.loading("Memperbaharui pas foto", { id: toastId });
      atlet.foto.downloadUrl = await sendFile(atlet.foto.file, fotoUrl);
      delete atlet.foto.file;
    }

    // UPLOAD NEW KTP
    if (atlet.ktp.file) {
      withStatus && toast.loading("Memperbaharui KTP", { id: toastId });
      atlet.ktp.downloadUrl = await sendFile(atlet.ktp.file, ktpUrl);
      delete atlet.ktp.file;
    }

    // UPLOAD NEW KK
    if (atlet.kk.file) {
      withStatus && toast.loading("Memperbaharui KK", { id: toastId });
      atlet.kk.downloadUrl = await sendFile(atlet.kk.file, kkUrl);
      delete atlet.kk.file;
    }

    withStatus && toast.loading("Memperbaharui atlet", { id: toastId });
    await axios.patch("/api/atlets", atlet);
    withStatus && toast.success("Atlet berhasil diperbaharui", { id: toastId });

    return atlet;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const deleteAtlet = async (
  dataAtlet: AtletState,
  dataKontingen?: KontingenState
) => {
  const withStatus = dataKontingen ? false : true;
  const toastId = withStatus ? toast.loading("Menghapus atlet") : undefined;

  let atlet: AtletState = dataAtlet;
  let kontingen: KontingenState | undefined = dataKontingen;

  const { fotoUrl, ktpUrl, kkUrl } = getFileUrl("atlet", atlet.id);
  try {
    // DELETE ATLET FROM KONTINGEN
    if (dataKontingen) {
      withStatus &&
        toast.loading("Menghapus atlet dari kontingen", { id: toastId });
      kontingen = await managePersonOnKontingen(dataKontingen, atlet, "delete");
    }

    // DELETE PAS FOTO
    withStatus && toast.loading("Menghapus pas foto atlet", { id: toastId });
    await axios.delete(`/api/file?directory=${fotoUrl}`);

    // DELETE KTP
    withStatus && toast.loading("Menghapus KTP", { id: toastId });
    await axios.delete(`/api/file?directory=${ktpUrl}`);

    // DELETE KK
    withStatus && toast.loading("Menghapus KK", { id: toastId });
    await axios.delete(`/api/file?directory=${kkUrl}`);

    // DELETE ATLET
    withStatus && toast.loading("Menghapus atlet", { id: toastId });
    await axios.delete(
      `/api/atlets?email=${atlet.creatorEmail}&id=${atlet.id}`
    );
    withStatus && toast.success("Atlet berhasil dihapus", { id: toastId });

    return kontingen;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const getPertandinganId = (
  pertandingan: {
    jenis: string;
    tingkatan: string;
    kategori: string;
  },
  useSpace: boolean = false
) => {
  let idPertandingan = `${pertandingan.jenis}-${pertandingan.tingkatan}-${pertandingan.kategori}`;
  if (useSpace) idPertandingan = idPertandingan.split("-").join(" - ");
  return idPertandingan;
};

export const splitPertandinganId = (
  idPertandingan: string,
  useStripe: boolean = false
) => {
  const splitCharacter = useStripe ? "-" : "/";
  const pertandinganArray = idPertandingan.split(splitCharacter);
  const jenisPertandingan = pertandinganArray[0];
  const tingkatan = pertandinganArray[1];
  const kategori = useStripe
    ? pertandinganArray.slice(2).join("")
    : pertandinganArray[2];
  const jenisKelamin = pertandinganArray[3];
  return { jenisPertandingan, tingkatan, kategori, jenisKelamin };
};

export const isAtletPaid = (atlet: AtletState) => {
  let paid = false;

  atlet.pertandingan.map((pertandingan) => {
    if (paid) return;
    if (
      atlet.pembayaran.find(
        (pembayaran) =>
          pembayaran.idPertandingan == getPertandinganId(pertandingan)
      )
    )
      paid = true;
  });

  return paid;
};

export const getAtletPaymentId = (atlet: AtletState) => {
  const idPertandingan = getPertandinganId(atlet.pertandingan[0]);
  const idPembayaran = atlet.pembayaran.find(
    (pembayaran) => pembayaran.idPertandingan == idPertandingan
  )?.idPembayaran;
  return idPembayaran as string;
};

export const getAllPertandinganUrl = () => {
  let pertandinganIds: string[] = [];
  tingkatanKategoriSilat.map((tingkatanKategori) => {
    tingkatanKategori.kategoriTanding.map((kategoriTanding) => {
      pertandinganIds.push(
        `Tanding/${tingkatanKategori.tingkatan}/${kategoriTanding}/Putra`
      );
      pertandinganIds.push(
        `Tanding/${tingkatanKategori.tingkatan}/${kategoriTanding}/Putri`
      );
    });
    tingkatanKategori.kategoriSeni.map((kategoriSeni) => {
      pertandinganIds.push(
        `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putra`
      );
    });
    tingkatanKategori.kategoriSeni.map((kategoriSeni) => {
      pertandinganIds.push(
        `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putri`
      );
    });
    // tingkatanKategori.kategoriSeni.putra.map((kategoriSeni) => {
    //   pertandinganIds.push(
    //     `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putra`
    //   );
    // });
    // tingkatanKategori.kategoriSeni.putri.map((kategoriSeni) => {
    //   pertandinganIds.push(
    //     `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putri`
    //   );
    // });
  });
  return pertandinganIds;
};
