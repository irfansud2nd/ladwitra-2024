import { reduceData } from "@/utils/admin/adminFunctions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CategorizedPeserta = {
  id: string;
  count: number;
};

type State = {
  kontingen: number;
  official: number;
  atlet: number;
  nomorPertandingan: number;

  categorizedAtlets: CategorizedPeserta[];

  sanggar: number;
  koreografer: number;
  penari: number;
  nomorTarian: number;

  categorizedPenaris: CategorizedPeserta[];

  payment: number;
  paymentConfirmed: number;
  paymentUnconfirmed: number;

  silatPayment: number;
  silatPaymentConfirmed: number;
  silatPaymentUnconfirmed: number;

  jaipongPayment: number;
  jaipongPaymentConfirmed: number;
  jaipongPaymentUnconfirmed: number;
};

const initialState: State = {
  kontingen: 0,
  official: 0,
  atlet: 0,
  nomorPertandingan: 0,

  categorizedAtlets: [],

  sanggar: 0,
  koreografer: 0,
  penari: 0,
  nomorTarian: 0,

  categorizedPenaris: [],

  payment: 0,
  paymentConfirmed: 0,
  paymentUnconfirmed: 0,

  silatPayment: 0,
  silatPaymentConfirmed: 0,
  silatPaymentUnconfirmed: 0,

  jaipongPayment: 0,
  jaipongPaymentConfirmed: 0,
  jaipongPaymentUnconfirmed: 0,
};

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCountKontingen: (state, action: PayloadAction<number>) => {
      state.kontingen = action.payload;
    },
    setCountOfficial: (state, action: PayloadAction<number>) => {
      state.official = action.payload;
    },
    setCountAtlet: (state, action: PayloadAction<number>) => {
      state.atlet = action.payload;
    },
    setCountNomorPertandingan: (state, action: PayloadAction<number>) => {
      state.nomorPertandingan = action.payload;
    },
    setCountSanggar: (state, action: PayloadAction<number>) => {
      state.sanggar = action.payload;
    },
    setCountKoreografer: (state, action: PayloadAction<number>) => {
      state.koreografer = action.payload;
    },
    setCountPenari: (state, action: PayloadAction<number>) => {
      state.penari = action.payload;
    },
    setCountNomorTarian: (state, action: PayloadAction<number>) => {
      state.nomorTarian = action.payload;
    },
    setCountPayment: (state, action: PayloadAction<number>) => {
      state.payment = action.payload;
    },
    setCountPaymentUnconfirmed: (state, action: PayloadAction<number>) => {
      state.paymentUnconfirmed = action.payload;
      state.paymentConfirmed = state.payment - action.payload;
    },
    setCountSilatPayment: (state, action: PayloadAction<number>) => {
      state.silatPayment = action.payload;
    },
    setCountSilatPaymentUnconfirmed: (state, action: PayloadAction<number>) => {
      state.silatPaymentUnconfirmed = action.payload;
      state.silatPaymentConfirmed = state.silatPayment - action.payload;
    },
    setCountJaipongPayment: (state, action: PayloadAction<number>) => {
      state.jaipongPayment = action.payload;
    },
    setCountJaipongPaymentUnconfirmed: (
      state,
      action: PayloadAction<number>
    ) => {
      state.jaipongPaymentUnconfirmed = action.payload;
      state.jaipongPaymentConfirmed = state.jaipongPayment - action.payload;
    },
    addCountCategorizedAtlets: (
      state,
      action: PayloadAction<{
        id: string;
        count: number;
      }>
    ) => {
      state.categorizedAtlets = reduceData([
        ...state.categorizedAtlets,
        action.payload,
      ]) as CategorizedPeserta[];
      [];
    },
    addCountCategorizedPenaris: (
      state,
      action: PayloadAction<{
        id: string;
        count: number;
      }>
    ) => {
      state.categorizedPenaris = reduceData([
        ...state.categorizedPenaris,
        action.payload,
      ]) as CategorizedPeserta[];
      [];
    },
  },
});

export const {
  setCountKontingen,
  setCountOfficial,
  setCountAtlet,
  setCountNomorPertandingan,
  setCountSanggar,
  setCountKoreografer,
  setCountPenari,
  setCountNomorTarian,
  setCountPayment,
  setCountPaymentUnconfirmed,
  setCountSilatPayment,
  setCountSilatPaymentUnconfirmed,
  setCountJaipongPayment,
  setCountJaipongPaymentUnconfirmed,
  addCountCategorizedAtlets,
  addCountCategorizedPenaris,
} = countSlice.actions;

export default countSlice.reducer;
