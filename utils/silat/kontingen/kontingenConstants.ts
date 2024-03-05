import * as Yup from "yup";

// KONTINGEN STATE
export const kontingenInitialValue: KontingenState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: 0,
  nama: "",
  atlets: [],
  nomorPertandingan: 0,
  officials: [],
  idPembayaran: [],
  totalPembayaran: 0,
  tagihan: 0,
};

// KONTINGEN STATE
export type KontingenState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number;
  nama: string;
  atlets: string[];
  nomorPertandingan: number;
  officials: string[];
  idPembayaran: string[];
  totalPembayaran: number;
  tagihan: number;
};

// KONTINGEN VALIDATION SCHEMA
export const kontingenValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama kontingen"),
});
