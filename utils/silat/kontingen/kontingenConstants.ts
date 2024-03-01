import * as Yup from "yup";

// KONTINGEN STATE
export const kontingenInitialValue: KontingenState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  nama: "",
  atlets: [],
  officials: [],
  idPembayaran: [],
  totalPembayaran: 0,
};

// KONTINGEN STATE
export type KontingenState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  nama: string;
  atlets: string[];
  officials: string[];
  idPembayaran: string[];
  totalPembayaran: number;
};

// KONTINGEN VALIDATION SCHEMA
export const kontingenValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama kontingen"),
});
