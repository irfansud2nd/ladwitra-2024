import { jenisKelaminPeserta } from "@/utils/form/FormConstants";
import * as Yup from "yup";

// KATEGORI GENERATOR
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];

const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah?: { namaKelas: string; batasKelas?: number },
  bebasAtas?: { namaKelas: string; batasKelas?: number }
) => {
  const repeatValue = alphabet.indexOf(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebasBawah)
    kategoriArr.push(
      `Kelas ${bebasBawah.namaKelas} (Dibawah ${
        bebasBawah.batasKelas ? bebasBawah.batasKelas : start
      } KG)`
    );

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${alphabet[i]} (${startKategori}-${startKategori + step} KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebasAtas)
    kategoriArr.push(
      `Kelas ${bebasAtas.namaKelas} (Diatas ${
        bebasAtas.batasKelas ? bebasAtas.batasKelas : endNumber
      } KG)`
    );
  return kategoriArr;
};

// SENI TUNGGAL
const seniTunggal = {
  putra: ["Tunggal Putra"],
  putri: ["Tunggal Putri"],
};

// SENI LENGKAP
const seniLengkap = {
  putra: ["Tunggal Putra", "Ganda Putra", "Regu Putra", "Solo Putra"],
  putri: ["Tunggal Putri", "Ganda Putri", "Regu Putri", "Solo Putri"],
};

// TINGKATAN DAN KATEGORI SILAT
export const tingkatanKategoriSilat = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("J", 18, 2),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan("K", 24, 2, undefined, {
      namaKelas: "Bebas",
    }),
    kategoriSeni: seniLengkap,
  },
  {
    tingkatan: "SMP",
    kategoriTanding: generateKategoriPertandingan("K", 30, 3, undefined, {
      namaKelas: "Bebas",
    }),
    kategoriSeni: seniLengkap,
  },
];

// JENIS PERTANDINGAN
export const jenisPertandingan = ["Tanding", "Seni"];

// ATLET TYPE
export type AtletState = {
  id: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  creatorEmail: string;
  nama: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  beratBadan: string;
  tinggiBadan: string;
  alamatLengkap: string;
  jenisKelamin: string;
  pertandingan: {
    tingkatan: string;
    jenis: string;
    kategori: string;
    idPembayaran: string;
  }[];
  nomorPertandingan: number;
  idKontingen: string;
  namaKontingen: string;
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

// ATLET INITIAL VALUE
export const atletInitialValue: AtletState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  nama: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  beratBadan: "",
  tinggiBadan: "",
  alamatLengkap: "",
  jenisKelamin: jenisKelaminPeserta[0],
  pertandingan: [],
  nomorPertandingan: 0,
  idKontingen: "",
  namaKontingen: "",
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

// ATLET VALIDATION SCHEMA
export const atletValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  NIK: Yup.string()
    .matches(/^[0-9]+$/, "NIK mengandung huruf")
    .min(16, "NIK tidak valid (< 16 digit)")
    .max(16, "NIK tidak valid (> 16 digit)")
    .required("Tolong lengkapi NIK"),
  alamatLengkap: Yup.string().required("Tolong lengkapi alamat"),
  tempatLahir: Yup.string().required("Tolong lengkapi tempat lahir"),
  tanggalLahir: Yup.string().required("Tolong lengkapi tanggal lahir"),
  beratBadan: Yup.number()
    .typeError("Berat badan mengandung huruf")
    .required("Tolong lengkapi berat badan"),
  tinggiBadan: Yup.number()
    .typeError("Tinggi badan mengandung huruf")
    .required("Tolong lengkapi tinggi badan"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Tolong lengkapi email"),
  noHp: Yup.number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
  ktpFile: Yup.string().required("Tolong lengkapi file KTP"),
  kkFile: Yup.string().required("Tolong lengkapi file KK"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
  namaKontingen: Yup.string().required(
    "Tolong daftarkan kontingen terlebih dahulu"
  ),
});

// ATLET VALIDATION SCHEMA WITHOUT FILE
export const atletValidationSchemaWithoutFile = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  NIK: Yup.string()
    .matches(/^[0-9]+$/, "NIK mengandung huruf")
    .min(16, "NIK tidak valid (< 16 digit)")
    .max(16, "NIK tidak valid (> 16 digit)")
    .required("Tolong lengkapi NIK"),
  alamatLengkap: Yup.string().required("Tolong lengkapi alamat"),
  tempatLahir: Yup.string().required("Tolong lengkapi tempat lahir"),
  tanggalLahir: Yup.string().required("Tolong lengkapi tanggal lahir"),
  beratBadan: Yup.number()
    .typeError("Berat badan mengandung huruf")
    .required("Tolong lengkapi berat badan"),
  tinggiBadan: Yup.number()
    .typeError("Tinggi badan mengandung huruf")
    .required("Tolong lengkapi tinggi badan"),
  email: Yup.string()
    .email("Email tidak valid")
    .required("Tolong lengkapi email"),
  noHp: Yup.number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
  namaKontingen: Yup.string().required(
    "Tolong daftarkan kontingen terlebih dahulu"
  ),
});

// REGISTER ATLET TYPE
export type UnregisteredAtletState = {
  atletId: string;
  tingkatanPertandingan: string;
  jenisPertandingan: string;
  kategoriPertandingan: string;
};

// REGISTER ATLET INITIAL STATE
export const unregisteredAtletValue: UnregisteredAtletState = {
  atletId: "",
  tingkatanPertandingan: tingkatanKategoriSilat[0].tingkatan,
  jenisPertandingan: jenisPertandingan[0],
  kategoriPertandingan: tingkatanKategoriSilat[0].kategoriTanding[0],
};

export type JenisPertandingan = "Tanding" | "Seni";
