import * as Yup from "yup";

// JENIS KELAMIN DEWASA
export const jenisKelaminDewasa = ["Pria", "Wanita"];

// JABATAN OFFICIAL
export const jabatanOfficials = ["Official", "Manajer Tim", "Pelatih"];

// OFFICIAL TYPE
export type OfficialState = {
  id: string;
  creatorEmail: string;
  waktuPendaftaran: number;
  nama: string;
  jenisKelamin: string;
  jabatan: string;
  idKontingen: string;
  namaKontingen: string;
  fotoFile: File | undefined;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// OFFICIAL INITIAL VALUE
export const officialInitialValue: OfficialState = {
  id: "",
  creatorEmail: "",
  waktuPendaftaran: 0,
  nama: "",
  jenisKelamin: jenisKelaminDewasa[0],
  jabatan: jabatanOfficials[0],
  idKontingen: "",
  namaKontingen: "",
  fotoFile: undefined,
  fotoUrl: "",
  downloadFotoUrl: "",
};

// OFFICIAL VALIDATION SCHEMA
export const officialValidationSchema = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  fotoFile: Yup.string().required("Tolong lengkapi file Pas Foto"),
  namaKontingen: Yup.string().required(
    "Tolong daftarkan kontingen terlebih dahulu"
  ),
});

// OFFICIAL VALIDATION SCHEMA WITHOUT FILE
export const officialValidationSchemaWithoutFile = Yup.object({
  nama: Yup.string().required("Tolong lengkapi nama lengkap"),
  namaKontingen: Yup.string().required(
    "Tolong daftarkan kontingen terlebih dahulu"
  ),
});
