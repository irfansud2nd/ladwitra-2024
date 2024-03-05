import { jenisKelaminPeserta } from "@/utils/form/FormConstants";
import * as Yup from "yup";

// KELAS TARIAN
export const kelasTarian = ["Pemula", "Mahir"];

// JENIS TARIAN
export const jenisTarian = ["Tunggal", "Rampak"];

// TINGKATAN DAN KATEGORI JAIPON
export const tingkatanKategoriJaipong = [
  {
    tingkatan: "SD I",
    kategori: ["1", "2", "3"],
  },
  {
    tingkatan: "SD II",
    kategori: ["4", "5", "6"],
  },
  {
    tingkatan: "SMP",
    kategori: ["7", "8", "9"],
  },
];

// PENARI TYPE
export type PenariState = {
  id: string;
  waktuPendaftaran: number;
  creatorEmail: string;
  nama: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamatLengkap: string;
  jenisKelamin: string;
  tarian: {
    jenis: string;
    kelas: string;
    tingkatan: string;
    kategori: string;
  }[];
  namaTim: {
    idTarian: string;
    namaTim: string;
  }[];
  pembayaran: {
    idTarian: string;
    idPembayaran: string;
  }[];
  nomorTarian: number;
  idSanggar: string;
  namaSanggar: string;
  fotoFile: File | undefined;
  downloadFotoUrl: string;
  fotoUrl: string;
  kkFile: File | undefined;
  kkUrl: string;
  downloadKkUrl: string;
  ktpFile: File | undefined;
  ktpUrl: string;
  downloadKtpUrl: string;
  email: string;
  noHp: string;
};

export const penariInitialValue: PenariState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: 0,
  nama: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  alamatLengkap: "",
  jenisKelamin: jenisKelaminPeserta[0],
  tarian: [],
  namaTim: [],
  pembayaran: [],
  nomorTarian: 0,
  idSanggar: "",
  namaSanggar: "",
  fotoFile: undefined,
  fotoUrl: "",
  downloadFotoUrl: "",
  kkFile: undefined,
  kkUrl: "",
  downloadKkUrl: "",
  ktpFile: undefined,
  ktpUrl: "",
  downloadKtpUrl: "",
  email: "",
  noHp: "",
};

// PENARI VALIDATION SCHEMA
export const penariValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  NIK: Yup.string()
    .matches(/^[0-9]+$/, "NIK mengandung huruf")
    .min(16, "NIK tidak valid (< 16 digit)")
    .max(16, "NIK tidak valid (> 16 digit)")
    .required("Tolong lengkapi NIK"),
  alamatLengkap: Yup.string().required("Tolong lengkapi alamat"),
  tempatLahir: Yup.string().required("Tolong lengkapi tempat lahir"),
  tanggalLahir: Yup.string().required("Tolong lengkapi tanggal lahir"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Tolong lengkapi email"),
  noHp: Yup.number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
  ktpFile: Yup.string().required("Tolong lengkapi file KTP"),
  kkFile: Yup.string().required("Tolong lengkapi file KK"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
  namaSanggar: Yup.string().required(
    "Tolong daftarkan sanggar terlebih dahulu"
  ),
});

// PENARI VALIDATION SCHEMA WITHOUT FILE
export const penariValidationSchemaWithoutFile = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  NIK: Yup.string()
    .matches(/^[0-9]+$/, "NIK mengandung huruf")
    .min(16, "NIK tidak valid (< 16 digit)")
    .max(16, "NIK tidak valid (> 16 digit)")
    .required("Tolong lengkapi NIK"),
  alamatLengkap: Yup.string().required("Tolong lengkapi alamat"),
  tempatLahir: Yup.string().required("Tolong lengkapi tempat lahir"),
  tanggalLahir: Yup.string().required("Tolong lengkapi tanggal lahir"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Tolong lengkapi email"),
  noHp: Yup.number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
  namaSanggar: Yup.string().required(
    "Tolong daftarkan sanggar terlebih dahulu"
  ),
});

// REGISTER PENARI TYPE
export type UnregisteredPenariState = {
  penariId: string;
  jenisTarian: string;
  kelasTarian: string;
  tingkatanTarian: string;
  kategoriTarian: string;
  namaTim: string;
};

// REGISTER PENARI INITIAL STATE
export const unregisteredPenariValue: UnregisteredPenariState = {
  penariId: "",
  jenisTarian: jenisTarian[0],
  kelasTarian: kelasTarian[0],
  tingkatanTarian: tingkatanKategoriJaipong[0].tingkatan,
  kategoriTarian: tingkatanKategoriJaipong[0].kategori[0],
  namaTim: "",
};

export type JenisTarian = "Tunggal" | "Rampak";

export const penariRampakValidationSchema = Yup.object({
  namaTim: Yup.string().required("Tolong lengkapi nama tim"),
});

export const biayaPenari = {
  rampak: 350000,
  tunggal: 200000,
};
