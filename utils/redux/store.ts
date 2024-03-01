import { configureStore } from "@reduxjs/toolkit";
import kontingenReducer from "@/utils/redux/silat/kontingenSlice";
import sanggarReducer from "@/utils/redux/jaipong/sanggarSlice";
import officialsReducer from "@/utils/redux/silat/officialsSlice";
import koreografersReducer from "@/utils/redux/jaipong/koreografersSlice";
import atletsReducer from "@/utils/redux/silat/atletsSlice";
import penarisReducer from "@/utils/redux/jaipong/penarisSlice";
import sideMenuReducer from "@/utils/redux/pendaftaran/sideMenuSlice";
import paymentsReducer from "@/utils/redux/silat/paymentsSlice";
import countReducer from "@/utils/redux/admin/countSlice";

export const store = configureStore({
  reducer: {
    kontingen: kontingenReducer,
    sanggar: sanggarReducer,
    officials: officialsReducer,
    koreografers: koreografersReducer,
    atlets: atletsReducer,
    penaris: penarisReducer,
    sideMenu: sideMenuReducer,
    payments: paymentsReducer,
    count: countReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
