import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  kontingen: number;
  official: number;
  atlet: number;
  registeredAtlet: number;
  silatPayment: number;
  silatConfirmedPayment: number;
  silatUnconfirmedPayment: number;
};

const initialState: State = {
  kontingen: 0,
  official: 0,
  atlet: 0,
  registeredAtlet: 0,
  silatPayment: 0,
  silatConfirmedPayment: 0,
  silatUnconfirmedPayment: 0,
};

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setKontingenCountRedux: (state, action: PayloadAction<number>) => {
      state.kontingen = action.payload;
    },
    setOfficialCountRedux: (state, action: PayloadAction<number>) => {
      state.official = action.payload;
    },
    setAtletCountRedux: (state, action: PayloadAction<number>) => {
      state.atlet = action.payload;
    },
    setRegisteredAtletCountRedux: (state, action: PayloadAction<number>) => {
      state.registeredAtlet = action.payload;
    },
    setSilatPaymentCountRedux: (state, action: PayloadAction<number>) => {
      state.silatPayment = action.payload;
    },
    setSilatConfirmedPaymentCountRedux: (
      state,
      action: PayloadAction<number>
    ) => {
      state.silatConfirmedPayment = action.payload;
      state.silatUnconfirmedPayment = state.silatPayment - action.payload;
    },
  },
});

export const {
  setKontingenCountRedux,
  setOfficialCountRedux,
  setAtletCountRedux,
  setRegisteredAtletCountRedux,
  setSilatPaymentCountRedux,
  setSilatConfirmedPaymentCountRedux,
} = countSlice.actions;

export default countSlice.reducer;
