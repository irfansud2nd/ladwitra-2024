import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  PaymentState,
  paymentInitialValue,
} from "@/utils/payment/paymentConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: PaymentState[];
  confirmed: PaymentState[];
  unconfirmed: PaymentState[];
  toConfirm: PaymentState;
};

const initialState: State = {
  all: [],
  confirmed: [],
  unconfirmed: [],
  toConfirm: paymentInitialValue,
};

const getConfirmed = (state: any, payments: PaymentState[]) => {
  state.confirmed = payments.filter((payment) => payment.confirmed);
  state.unconfirmed = payments.filter((payment) => !payment.confirmed);
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    // SET PAYMENTS
    setPaymentsRedux: (state, action: PayloadAction<PaymentState[]>) => {
      state.all = action.payload;
      getConfirmed(state, action.payload);
    },
    // ADD PAYMENTS
    addPaymentsRedux: (state, action: PayloadAction<PaymentState[]>) => {
      const newPayments = reduceData([
        ...state.all,
        ...action.payload,
      ]) as PaymentState[];
      state.all = newPayments.sort(compare("waktuPembayaran", "desc"));
      getConfirmed(state, newPayments);
    },
    // ADD PAYMENT
    addPaymentRedux: (state, action: PayloadAction<PaymentState>) => {
      const newPayments = [...state.all, action.payload];

      state.all = newPayments;
      getConfirmed(state, newPayments);
    },
    // UPDATE PAYMENT
    updatePaymentRedux: (state, action: PayloadAction<PaymentState>) => {
      let newPayments = [...state.all].filter(
        (payment) => payment.id != action.payload.id
      );
      newPayments.push(action.payload);
      state.all = newPayments.sort(compare("waktuPembayaran", "desc"));
      getConfirmed(state, newPayments);
    },
    // SET PAYMENT TO CONFIRM
    setPaymentToConfirmRedux: (state, action: PayloadAction<PaymentState>) => {
      state.toConfirm = action.payload;
    },
    // DELETE PAYMENT
    deletePaymentRedux: (state, action: PayloadAction<PaymentState>) => {
      const newPayments = [...state.all].filter(
        (payment) => payment.id != action.payload.id
      );
      state.all = newPayments;
      getConfirmed(state, newPayments);
    },
  },
});

export const {
  setPaymentsRedux,
  addPaymentsRedux,
  addPaymentRedux,
  updatePaymentRedux,
  setPaymentToConfirmRedux,
  deletePaymentRedux,
} = paymentsSlice.actions;
export default paymentsSlice.reducer;
