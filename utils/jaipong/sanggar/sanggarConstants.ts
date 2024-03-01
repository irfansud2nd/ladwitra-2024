import * as Yup from "yup";

// SANGGAR STATE
export const sanggarInitialValue: SanggarState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  nama: "",
  penaris: [],
  koreografers: [],
  idPembayaran: [],
  totalPembayaran: 0,
};

// SANGGAR STATE
export type SanggarState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  nama: string;
  penaris: string[];
  koreografers: string[];
  idPembayaran: string[];
  totalPembayaran: number;
};

// SANGGAR VALIDATION SCHEMA
export const sanggarValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama sanggar"),
});
