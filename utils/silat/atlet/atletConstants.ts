import { jenisKelaminPeserta } from "@/utils/form/FormConstants";
import * as Yup from "yup";

const numberToAlphabet = (index: number) => {
  return String.fromCharCode(index + "A".charCodeAt(0));
};

const alphabetToNumber = (letter: string) => {
  return letter.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
};

const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebasBawah?: { namaKelas: string; batasKelas?: number },
  bebasAtas?: { namaKelas: string; batasKelas?: number }
) => {
  const repeatValue = alphabetToNumber(endAlphabet);
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
      `Kelas ${numberToAlphabet(i)} (${startKategori}-${
        startKategori + step
      } KG)`
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
const seniTunggal = ["Tunggal"];

// SENI LENGKAP
const seniLengkap = ["Tunggal", "Ganda", "Regu", "Solo"];

const seniSd2 = ["Tunggal Tangan Kosong", "Tunggal Bersenjata", "Tunggal Full"];
const seniSd1 = [seniSd2[0]];

// TINGKATAN DAN KATEGORI SILAT
export const tingkatanKategoriSilat = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("J", 18, 2),
    kategoriSeni: seniSd1,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan("K", 24, 2, undefined, {
      namaKelas: "Bebas",
    }),
    kategoriSeni: seniSd2,
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
  waktuPendaftaran: number;
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
    jenis: string;
    tingkatan: string;
    kategori: string;
  }[];
  pembayaran: {
    idPertandingan: string;
    idPembayaran: string;
  }[];
  idPembayaran: string[];
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
  waktuPendaftaran: 0,
  nama: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  beratBadan: "",
  tinggiBadan: "",
  alamatLengkap: "",
  jenisKelamin: jenisKelaminPeserta[0],
  pertandingan: [],
  pembayaran: [],
  idPembayaran: [],
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
  jenisPertandingan: string;
  tingkatanPertandingan: string;
  kategoriPertandingan: string;
};

// REGISTER ATLET INITIAL STATE
export const unregisteredAtletValue: UnregisteredAtletState = {
  atletId: "",
  jenisPertandingan: jenisPertandingan[0],
  tingkatanPertandingan: tingkatanKategoriSilat[0].tingkatan,
  kategoriPertandingan: tingkatanKategoriSilat[0].kategoriTanding[0],
};

export type JenisPertandingan = "Tanding" | "Seni";

export const biayaAtlet = 300000;
