import * as Yup from "yup";

// SANGGAR STATE
export const sanggarInitialValue: SanggarState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: 0,
  nama: "",
  penaris: [],
  nomorTarian: 0,
  koreografers: [],
  idPembayaran: [],
  totalPembayaran: 0,
  tagihan: 0,
};

// SANGGAR STATE
export type SanggarState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number;
  nama: string;
  penaris: string[];
  nomorTarian: number;
  koreografers: string[];
  idPembayaran: string[];
  totalPembayaran: number;
  tagihan: number;
};

// SANGGAR VALIDATION SCHEMA
export const sanggarValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama sanggar"),
});
