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
  pembayaran: {
    ids: [],
    total: 0,
    tagihan: 0,
  },
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
  pembayaran: {
    ids: string[];
    total: number;
    tagihan: number;
  };
};

// KONTINGEN VALIDATION SCHEMA
export const kontingenValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama kontingen"),
});
