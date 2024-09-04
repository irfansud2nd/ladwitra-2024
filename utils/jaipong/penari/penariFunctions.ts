import { SanggarState } from "../sanggar/sanggarConstants";
import {
  PenariState,
  biayaPenari,
  jenisTarian,
  kelasTarian,
  laguTunggalPemasalan,
  laguTunggalPrestasi,
  tingkatanKategoriJaipong,
} from "./penariConstants";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { getFileUrl, sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { managePersonOnSanggar } from "../sanggar/sanggarFunctions";
import axios from "axios";

export const selectCategoryJaipong = (tingkatan: string) => {
  return tingkatanKategoriJaipong.find((item) => item.tingkatan == tingkatan)
    ?.kategori as string[];
};

export const selectLagu = (kelas: string) => {
  if (kelas == "Pemasalan") return laguTunggalPemasalan;
  return laguTunggalPrestasi;
};

export const sendPenari = async (
  dataPenari: PenariState,
  dataSanggar: SanggarState
) => {
  const toastId = toast.loading("Mendaftarkan Penari");
  const newDocRef = doc(collection(firestore, "penaris"));
  const id = newDocRef.id;

  let penari: PenariState = { ...dataPenari, id, waktuPendaftaran: Date.now() };
  let sanggar: SanggarState = dataSanggar;

  const { fotoUrl } = getFileUrl("penari", id);

  try {
    if (!penari.creatorEmail) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!penari.fotoFile) throw { message: "Pas foto tidak ditemukan" };

    // SEND FOTO
    toast.loading("Mengunggah pas foto penari", { id: toastId });
    penari.downloadFotoUrl = await sendFile(penari.fotoFile, fotoUrl);
    delete penari.fotoFile;

    // ADD PENARI TO SANGGAR
    toast.loading("Menambahkan penari ke sanggar", { id: toastId });
    sanggar = await managePersonOnSanggar(sanggar, penari, "add");

    // SEND PENARI
    toast.loading("Mendaftarkan penari", { id: toastId });
    await axios.post("/api/penaris", penari);
    toast.success("Penari berhasil didaftarkan", { id: toastId });
    return { sanggar, penari };
  } catch (error) {
    toastFirebaseError(error, toastId);
    throw error;
  }
};

export const updatePenari = async (
  dataPenari: PenariState,
  withStatus: boolean = true
) => {
  let penari: PenariState = { ...dataPenari };
  const { fotoUrl } = getFileUrl("penari", penari.id);
  const toastId = withStatus
    ? toast.loading("Memperbaharui data penari")
    : undefined;
  try {
    // UPLOAD NEW PAS FOTO
    if (penari.fotoFile) {
      withStatus && toast.loading("Memperbaharui pas foto", { id: toastId });
      penari.downloadFotoUrl = await sendFile(penari.fotoFile, fotoUrl);
      delete penari.fotoFile;
    }

    withStatus && toast.loading("Memperbaharui penari", { id: toastId });
    await axios.patch("/api/penaris", penari);
    withStatus &&
      toast.success("Penari berhasil diperbaharui", { id: toastId });

    return penari;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const deletePenari = async (
  dataPenari: PenariState,
  dataSanggar?: SanggarState
) => {
  const withStatus = dataSanggar ? false : true;
  const toastId = withStatus ? toast.loading("Menghapus penari") : undefined;

  let penari: PenariState = dataPenari;
  let sanggar: SanggarState | undefined = dataSanggar;

  const { fotoUrl, ktpUrl, kkUrl } = getFileUrl("penari", penari.id);
  try {
    // DELETE PENARI FROM SANGGAR
    if (dataSanggar) {
      withStatus &&
        toast.loading("Menghapus penari dari sanggar", { id: toastId });
      sanggar = await managePersonOnSanggar(dataSanggar, penari, "delete");
    }

    // DELETE PAS FOTO
    withStatus && toast.loading("Menghapus pas foto penari", { id: toastId });
    await axios.delete(`/api/file?directory=${fotoUrl}`);

    // DELETE KTP
    withStatus && toast.loading("Menghapus KTP", { id: toastId });
    await axios.delete(`/api/file?directory=${ktpUrl}`);

    // DELETE KK
    withStatus && toast.loading("Menghapus KK", { id: toastId });
    await axios.delete(`/api/file?directory=${kkUrl}`);

    // DELETE PENARI
    withStatus && toast.loading("Menghapus penari", { id: toastId });
    await axios.delete(
      `/api/penaris?email=${penari.creatorEmail}&id=${penari.id}`
    );
    withStatus && toast.success("Penari berhasil dihapus", { id: toastId });

    return sanggar;
  } catch (error) {
    withStatus && toastFirebaseError(error, toastId);
    throw error;
  }
};

export const getBiayaPenaris = (penaris: PenariState[]) => {
  let total = 0;
  penaris.map((penari: PenariState) => {
    penari.tarian[0].jenis == "Tunggal" ? (total += 200000) : (total += 350000);
  });
  return total;
};

export const getTarianId = (
  tarian: {
    jenis: string;
    kelas: string;
    tingkatan: string;
    kategori: string;
  },
  options?: {
    useSpace?: boolean;
    fullId?: {
      namaTim: string;
      lagu: string;
    };
  }
) => {
  const useSpace = options?.useSpace;
  const fullId = options?.fullId;

  let idTarian = `${tarian.jenis}-${tarian.kelas}-${tarian.tingkatan}-${tarian.kategori}`;

  if (fullId) idTarian += `-${fullId.namaTim}-${fullId.lagu}`;

  if (useSpace) idTarian = idTarian.split("-").join(" - ");
  return idTarian;
};

export const splitTarianId = (idTarian: string) => {
  const tarianArray = idTarian.split("/");
  const jenisTarian = tarianArray[0];
  const kelas = tarianArray[1];
  const tingkatan = tarianArray[2];
  const kategori = tarianArray[3];
  const jenisKelamin = tarianArray[4];
  const lagu = tarianArray[5];
  return { jenisTarian, kelas, tingkatan, kategori, jenisKelamin, lagu };
};

export const isPenariPaid = (
  penari: PenariState,
  registeredPenari: boolean = false
) => {
  let paid = false;

  if (registeredPenari) {
    let pembayaranIndex = 0;
    while (pembayaranIndex < penari.pembayaran.length && !paid) {
      if (
        penari.pembayaran.find(
          (item) =>
            item.idTarian ==
            getTarianId(penari.tarian[0], {
              fullId: {
                namaTim: getPenariNamaTim(penari),
                lagu: getPenariLagu(penari),
              },
            })
        )
      ) {
        paid = true;
      }
      pembayaranIndex++;
    }
  } else {
    penari.pembayaran.length && (paid = true);
  }

  return paid;
};

export const getPenariPaymentId = (penari: PenariState) => {
  const idTarian = getTarianId(penari.tarian[0], {
    fullId: {
      namaTim: getPenariNamaTim(penari),
      lagu: getPenariLagu(penari),
    },
  });
  const idPembayaran = penari.pembayaran.find(
    (pembayaran) => pembayaran.idTarian == idTarian
  )?.idPembayaran;
  return idPembayaran as string;
};

export const getPenariNamaTim = (
  penari: PenariState,
  indexTarian?: number,
  indexNamaTim?: number
) => {
  const iTarian = indexTarian || 0;
  const iNamaTim = indexNamaTim || 0;
  const namaTims = penari.namaTim.filter(
    (namaTim) => namaTim.idTarian == getTarianId(penari.tarian[iTarian])
  );
  if (!namaTims[iNamaTim]) return "";
  return namaTims[iNamaTim].namaTim;
};

export const getPenariLagu = (
  penari: PenariState,
  indexTarian?: number,
  indexLagu?: number
) => {
  const iTarian = indexTarian || 0;
  const iLagu = indexLagu || 0;
  const lagus = penari.lagu.filter(
    (lagu) => lagu.idTarian == getTarianId(penari.tarian[iTarian])
  );
  if (!lagus[iLagu]) return "";
  return lagus[iLagu].lagu;
};

export const getBiayaPenari = (penari: PenariState) => {
  let biaya = 0;
  penari.tarian.map((tarian) => {
    if (tarian.jenis == "Rampak") {
      biaya += biayaPenari.rampak;
    } else {
      biaya += biayaPenari.tunggal;
    }
  });
  return biaya;
};

export const getAllTarianUrl = () => {
  let tarianIds: string[] = [];
  jenisTarian.map((jenis) => {
    kelasTarian.map((kelas) => {
      tingkatanKategoriJaipong.map((tingkatanKategori) => {
        tingkatanKategori.kategori.map((kategori) => {
          tarianIds.push(
            `${jenis}/${kelas}/${tingkatanKategori.tingkatan}/${kategori}/Putra`
          );
          tarianIds.push(
            `${jenis}/${kelas}/${tingkatanKategori.tingkatan}/${kategori}/Putri`
          );
        });
      });
    });
  });
  return tarianIds;
};
