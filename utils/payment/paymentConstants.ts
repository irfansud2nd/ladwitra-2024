import * as Yup from "yup";
export type PaymentState = {
  id: string;
  pembayaran: {
    total: number;
    waktu: number;
  };
  bukti: {
    file?: undefined;
    downloadUrl: string;
  };
  creatorEmail: string;
  noHp: string;
  confirmed: {
    state: boolean;
    by: string;
  };
  source: "jaipong" | "silat";
};

export const paymentInitialValue: PaymentState = {
  id: "",
  pembayaran: {
    total: 0,
    waktu: 0,
  },
  bukti: {
    downloadUrl: "",
  },
  creatorEmail: "",
  noHp: "",
  confirmed: { state: false, by: "" },
  source: "silat",
};

export type ConfirmPaymentState = {
  totalPembayaran: number;
  // confirmedTotalPembayaran: number;
  confirmedBy: string;
};

export const confirmPaymentInitialValue: ConfirmPaymentState = {
  totalPembayaran: 0,
  // confirmedTotalPembayaran: 0,
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
