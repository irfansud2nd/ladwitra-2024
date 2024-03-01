import * as Yup from "yup";

// JENIS KELAMIN DEWASA
export const jenisKelaminDewasa = ["Pria", "Wanita"];

// JABATAN KOREOGRAFER
export const jabatanKoreografers = ["Official", "Manajer Tim", "Pelatih"];

// KOREOGRAFER TYPE
export type KoreograferState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  nama: string;
  jenisKelamin: string;
  jabatan: string;
  idSanggar: string;
  namaSanggar: string;
  fotoFile: File | undefined;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// KOREOGRAFER INITIAL VALUE
export const koreograferInitialValue: KoreograferState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  nama: "",
  jenisKelamin: jenisKelaminDewasa[0],
  jabatan: jabatanKoreografers[0],
  idSanggar: "",
  namaSanggar: "",
  fotoFile: undefined,
  fotoUrl: "",
  downloadFotoUrl: "",
};

// KOREOGRAFER VALIDATION SCHEMA WITH SANGgAR
export const koreograferValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
  namaSanggar: Yup.string().required(
    "Tolong daftarkan sanggar terlebih dahulu"
  ),
});
