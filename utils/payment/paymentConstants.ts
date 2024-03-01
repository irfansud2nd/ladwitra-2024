import * as Yup from "yup";
export type PaymentState = {
  id: string;
  totalPembayaran: number;
  buktiFile: File | undefined;
  buktiUrl: string;
  downloadBuktiUrl: string;
  creatorEmail: string;
  noHp: string;
  confirmed: boolean;
  confirmedBy: string;
  source: "jaipong" | "silat";
};

export const paymentInitialValue: PaymentState = {
  id: "",
  totalPembayaran: 0,
  buktiFile: undefined,
  buktiUrl: "",
  downloadBuktiUrl: "",
  creatorEmail: "",
  noHp: "",
  confirmed: false,
  confirmedBy: "",
  source: "silat",
};

export type ConfirmPaymentState = {
  totalPembayaran: number;
  confirmedTotalPembayaran: number;
  confirmedBy: string;
};

export const confirmPaymentInitialValue: ConfirmPaymentState = {
  totalPembayaran: 0,
  confirmedTotalPembayaran: 0,
  confirmedBy: "",
};

export const confirmPaymentValidationSchema = Yup.object({
  confirmedTotalPembayaran: Yup.string().required(
    "Tolong lengkapi total pembayaran dikonfirmasi"
  ),
});

export const paymentValidationSchema = Yup.object({
  buktiFile: Yup.string().required("Tolong lengkapi bukti pembayaran"),
  noHp: Yup.number()
    .typeError("No HP mengandung huruf")
    .required("Tolong lengkapi No HP"),
});
