import { reduceData } from "@/utils/admin/adminFunctions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CategorizedAtlet = {
  id: string;
  count: number;
};

type State = {
  kontingen: number;
  official: number;
  atlet: number;
  registeredAtlet: number;

  categorizedAtlets: CategorizedAtlet[];

  sanggar: number;
  koreografer: number;
  penari: number;
  registeredPenari: number;

  payment: number;
  confirmedPayment: number;
  unconfirmedPayment: number;

  silatPayment: number;
  silatPaymentConfirmed: number;
  silatPaymentUnconfirmed: number;

  penariPayment: number;
  penariPaymentConfirmed: number;
  penariPaymentUnconfirmed: number;
};

const initialState: State = {
  kontingen: 0,
  official: 0,
  atlet: 0,
  registeredAtlet: 0,

  categorizedAtlets: [],

  sanggar: 0,
  koreografer: 0,
  penari: 0,
  registeredPenari: 0,

  payment: 0,
  confirmedPayment: 0,
  unconfirmedPayment: 0,

  silatPayment: 0,
  silatPaymentConfirmed: 0,
  silatPaymentUnconfirmed: 0,

  penariPayment: 0,
  penariPaymentConfirmed: 0,
  penariPaymentUnconfirmed: 0,
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
    setCountRegisteredAtlet: (state, action: PayloadAction<number>) => {
      state.registeredAtlet = action.payload;
    },
    setCountSilatPayment: (state, action: PayloadAction<number>) => {
      state.silatPayment = action.payload;
    },
    setCountSilatPaymentUnconfirmed: (state, action: PayloadAction<number>) => {
      state.silatPaymentUnconfirmed = action.payload;
      state.silatPaymentConfirmed = state.silatPayment - action.payload;
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
      ]) as CategorizedAtlet[];
    },
  },
});

export const {
  setCountKontingen,
  setCountOfficial,
  setCountAtlet,
  setCountRegisteredAtlet,
  setCountSilatPayment,
  setCountSilatPaymentUnconfirmed,
  addCountCategorizedAtlets,
} = countSlice.actions;

export default countSlice.reducer;
