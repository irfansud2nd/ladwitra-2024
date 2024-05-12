import * as Yup from "yup";

// JENIS KELAMIN DEWASA
export const jenisKelaminDewasa = ["Pria", "Wanita"];

// JABATAN KOREOGRAFER
export const jabatanKoreografers = ["Official", "Manajer Tim", "Pelatih"];

// KOREOGRAFER TYPE
export type KoreograferState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number;
  nama: string;
  jenisKelamin: string;
  jabatan: string;
  sanggar: {
    id: string;
    nama: string;
  };
  foto: {
    file?: File;
    downloadUrl: string;
  };
};

// KOREOGRAFER INITIAL VALUE
export const koreograferInitialValue: KoreograferState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: 0,
  nama: "",
  jenisKelamin: jenisKelaminDewasa[0],
  jabatan: jabatanKoreografers[0],
  sanggar: {
    nama: "",
    id: "",
  },
  foto: {
    downloadUrl: "",
  },
};

// KOREOGRAFER VALIDATION SCHEMA
export const koreograferValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
  namaSanggar: Yup.string().required(
    "Tolong daftarkan sanggar terlebih dahulu"
  ),
});
// KOREOGRAFER VALIDATION SCHEMA WITHOUT FILE
export const koreograferValidationSchemaWithoutFile = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  namaSanggar: Yup.string().required(
    "Tolong daftarkan sanggar terlebih dahulu"
  ),
});
