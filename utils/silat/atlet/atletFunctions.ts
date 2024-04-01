import axios from "axios";
import {
  AtletState,
  jenisPertandingan,
  tingkatanKategoriSilat,
} from "./atletConstats";
import { SetSubmitting, jenisKelaminPeserta } from "@/utils/form/FormConstants";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { collection, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { sendFile } from "@/utils/form/FormFunctions";
import { toastFirebaseError } from "@/utils/functions";
import { KontingenState } from "../kontingen/kontingenConstants";
import { managePersonOnKontingen } from "../kontingen/kontingenFunctions";
import {
  addAtletRedux,
  deleteAtletRedux,
  updateAtletRedux,
} from "@/utils/redux/silat/atletsSlice";

// CALCULATE AGE
export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

// SELECT DEFAULT CATEGORY
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
    if (jenisKelamin == jenisKelaminPeserta[0]) {
      return tingkatanKategoriSilat[
        tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriSeni.putra;
    } else {
      return tingkatanKategoriSilat[
        tingkatanKategoriSilat.findIndex((item) => item.tingkatan == tingkatan)
      ].kategoriSeni.putri;
    }
  }
};

// SEND ATLET
export const sendAtlet = (
  atlet: AtletState,
  kontingen: KontingenState,
  dispatch: Dispatch<UnknownAction>,
  setSubmitting: SetSubmitting,
  resetForm: () => void
) => {
  if (!atlet.creatorEmail) {
    toast.error("Creator Email not found !");
    setSubmitting(false);
    return;
  }
  const newDocRef = doc(collection(firestore, "atlets"));
  const id = newDocRef.id;
  const fotoUrl = `atlets/pasFoto/${id}`;
  const kkUrl = `atlets/kk/${id}`;
  const ktpUrl = `atlets/ktp/${id}`;
  let downloadFotoUrl = "";
  let downloadKtpUrl = "";
  let downloadKkUrl = "";
  const toastId = toast.loading("Mendaftarkan atlet");

  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // SEND FOTO
        toast.loading("Mengunggah pas foto atlet", { id: toastId });
        if (!atlet.fotoFile) return;
        sendFile(atlet.fotoFile, fotoUrl)
          .then((url) => {
            downloadFotoUrl = url;
            stepController(2);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 2:
        // SEND KTP
        toast.loading("Mengunggah KTP atlet", { id: toastId });
        if (!atlet.ktpFile) return;
        sendFile(atlet.ktpFile, ktpUrl)
          .then((url) => {
            downloadKtpUrl = url;
            stepController(3);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // SEND KK
        toast.loading("Mengunggah KK atlet", { id: toastId });
        if (!atlet.kkFile) return;
        sendFile(atlet.kkFile, kkUrl)
          .then((url) => {
            downloadKkUrl = url;
            stepController(4);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        // ADD ATLET TO KONTINGEN
        toast.loading("Menambahkan atlet ke kontingen", { id: toastId });
        managePersonOnKontingen(kontingen, "atlets", id, "add", dispatch)
          .then(() => {
            stepController(5);
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 5:
        // SEND ATLET
        toast.loading("Mendaftarkan atlet", { id: toastId });
        delete atlet.fotoFile;
        delete atlet.kkFile;
        delete atlet.ktpFile;
        const dataAtlet: AtletState = {
          ...atlet,
          id,
          fotoUrl,
          downloadFotoUrl,
          ktpUrl,
          downloadKtpUrl,
          kkUrl,
          downloadKkUrl,
          waktuPendaftaran: Date.now(),
        };

        axios
          .post("/api/atlets", dataAtlet)
          .then((res) => {
            toast.success("Atlet berhasil didaftarkan", { id: toastId });
            dispatch(addAtletRedux(dataAtlet));
            setSubmitting(false);
            resetForm();
          })
          .catch((error) => {
            setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
    }
  };
  stepController(1);
};

// UPDATE ATLET
export const updateAtlet = (
  atlet: AtletState,
  dispatch: Dispatch<UnknownAction>,
  options?: {
    setSubmitting?: SetSubmitting;
    onComplete?: () => void;
    withoutStatus?: boolean;
  }
) => {
  const setSubmitting = options?.setSubmitting;
  const onComplete = options?.onComplete;
  const withoutStatus = options?.withoutStatus || false;

  const toastId = withoutStatus
    ? undefined
    : toast.loading("Memperbaharui data atlet");
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // CHECK IF PAS FOTO CHANGED
        if (atlet.fotoFile) {
          stepController(2);
        } else {
          stepController(4);
        }
        break;
      case 2:
        // DELETE OLD PAS FOTO
        !withoutStatus &&
          toast.loading("Menghapus pas foto lama", { id: toastId });
        axios
          .delete(`/api/file/${atlet.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // UPLOAD NEW PAS FOTO
        !withoutStatus &&
          toast.loading("Mengunggah pas foto baru", { id: toastId });
        atlet.fotoFile &&
          sendFile(atlet.fotoFile, atlet.fotoUrl)
            .then((url) => {
              atlet.downloadFotoUrl = url;
              stepController(4);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 4:
        // CHECK IF KTP CHANGED
        if (atlet.ktpFile) {
          stepController(5);
        } else {
          stepController(7);
        }
        break;
      case 5:
        // DELETE OLD KTP
        !withoutStatus && toast.loading("Menghapus KTP lama", { id: toastId });
        axios
          .delete(`/api/file/${atlet.ktpUrl}`)
          .then(() => stepController(6))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 6:
        // UPLOAD NEW KTP
        !withoutStatus && toast.loading("Mengunggah KTP baru", { id: toastId });
        atlet.ktpFile &&
          sendFile(atlet.ktpFile, atlet.ktpUrl)
            .then((url) => {
              atlet.downloadKtpUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 7:
        // CHECK IF KK CHANGED
        if (atlet.kkFile) {
          stepController(8);
        } else {
          stepController(10);
        }
        break;
      case 8:
        // DELETE OLD KK
        !withoutStatus && toast.loading("Menghapus KK lama", { id: toastId });
        axios
          .delete(`/api/file/${atlet.kkUrl}`)
          .then(() => stepController(9))
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
      case 9:
        // UPLOAD NEW KK
        !withoutStatus && toast.loading("Mengunggah KK baru", { id: toastId });
        atlet.kkFile &&
          sendFile(atlet.kkFile, atlet.kkUrl)
            .then((url) => {
              atlet.downloadKkUrl = url;
              stepController(7);
            })
            .catch((error) => {
              setSubmitting && setSubmitting(false);
              toastFirebaseError(error, toastId);
            });
        break;
      case 10:
        // UPDATE ATLET
        !withoutStatus &&
          toast.loading("Memperbaharui data atlet", { id: toastId });
        atlet.fotoFile && delete atlet.fotoFile;
        atlet.ktpFile && delete atlet.ktpFile;
        atlet.kkFile && delete atlet.kkFile;

        axios
          .patch("/api/atlets", atlet)
          .then((res) => {
            dispatch(updateAtletRedux(atlet));
            !withoutStatus &&
              toast.success("Atlet berhasil diperbaharui", { id: toastId });
            onComplete && onComplete();
            setSubmitting && setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting && setSubmitting(false);
            toastFirebaseError(error, toastId);
          });
        break;
    }
  };
  stepController(1);
};

// DELETE ATLET
export const deleteAtlet = (
  atlet: AtletState,
  dispatch: Dispatch<UnknownAction>,
  kontingen?: KontingenState,
  onComplete?: () => void,
  withStatus: boolean = true
) => {
  const toastId = withStatus ? toast.loading("Menghapus atlet") : undefined;
  const stepController = (step: number) => {
    switch (step) {
      case 1:
        // DELETE ATLET FROM KONTINGEN
        if (!kontingen) {
          stepController(2);
          return;
        }
        withStatus &&
          toast.loading("Menghapus atlet dari kontingen", { id: toastId });
        managePersonOnKontingen(
          kontingen,
          "atlets",
          atlet.id,
          "delete",
          dispatch,
          {
            atlet,
          }
        )
          .then(() => {
            stepController(2);
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
      case 2:
        // DELETE PAS FOTO
        withStatus &&
          toast.loading("Menghapus pas foto atlet", { id: toastId });
        axios
          .delete(`/api/file/${atlet.fotoUrl}`)
          .then(() => stepController(3))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 3:
        // DELETE KTP
        withStatus && toast.loading("Menghapus KTP atlet", { id: toastId });
        axios
          .delete(`/api/file/${atlet.ktpUrl}`)
          .then(() => stepController(4))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 4:
        // DELETE KK
        withStatus && toast.loading("Menghapus kk atlet", { id: toastId });
        axios
          .delete(`/api/file/${atlet.kkUrl}`)
          .then(() => stepController(5))
          .catch((error) => {
            toastFirebaseError(error, toastId);
          });
        break;
      case 5:
        // DELETE ATLET
        withStatus && toast.loading("Menghapus atlet", { id: toastId });
        axios
          // .delete(`/api/atlets/${atlet.creatorEmail}/${atlet.id}`)
          .delete(`/api/atlets?email=${atlet.creatorEmail}&id=${atlet.id}`)
          .then((res) => {
            withStatus &&
              toast.success("Atlet berhasil dihapus", { id: toastId });
            dispatch(deleteAtletRedux(atlet));
            onComplete && onComplete();
          })
          .catch((error) => toastFirebaseError(error, toastId));
        break;
    }
  };
  stepController(1);
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
    tingkatanKategori.kategoriSeni.putra.map((kategoriSeni) => {
      pertandinganIds.push(
        `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putra`
      );
    });
    tingkatanKategori.kategoriSeni.putri.map((kategoriSeni) => {
      pertandinganIds.push(
        `Seni/${tingkatanKategori.tingkatan}/${kategoriSeni}/Putri`
      );
    });
  });
  return pertandinganIds;
};
