import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  KoreograferState,
  koreograferInitialValue,
} from "@/utils/jaipong/koreografer/koreograferConstants";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: KoreograferState[];
  registered: KoreograferState[];
  toEdit: KoreograferState;
};

const initialState: State = {
  all: [],
  registered: [],
  toEdit: koreograferInitialValue,
};

const koreografersSlice = createSlice({
  name: "koreografers",
  initialState,
  reducers: {
    // SET OFFFICIAL
    setKoreografersRedux: (
      state,
      action: PayloadAction<KoreograferState[]>
    ) => {
      state.registered = action.payload.sort(compare("nama", "asc"));
    },
    // ADD KOREOGRAFERS
    addKoreografersRedux: (
      state,
      action: PayloadAction<KoreograferState[]>
    ) => {
      state.registered = action.payload;
      const newKoreografers = reduceData([
        ...state.all,
        ...action.payload,
      ]) as KoreograferState[];
      state.all = newKoreografers;
    },
    // UPDATE KOREOGRAFER
    updateKoreograferRedux: (
      state,
      action: PayloadAction<KoreograferState>
    ) => {
      const koreografer = action.payload;

      let newKoreografers = [...state.registered];
      newKoreografers = newKoreografers.filter(
        (item) => item.id != koreografer.id
      );
      newKoreografers.push(koreografer);
      state.registered = newKoreografers.sort(compare("nama", "asc"));
    },
    // ADD KOREOGRAFER
    addKoreograferRedux: (state, action: PayloadAction<KoreograferState>) => {
      const koreografer = action.payload;
      const koreografers = [...state.registered, koreografer];
      state.registered = koreografers.sort(compare("nama", "asc"));
    },
    // DELETE KOREOGRAFER
    deleteKoreograferRedux: (
      state,
      action: PayloadAction<KoreograferState>
    ) => {
      const koreografer = action.payload;
      const koreografers = [...state.registered].filter(
        (item) => item.id != koreografer.id
      );
      state.registered = koreografers.sort(compare("nama", "asc"));
    },
    // SET KOREOGRAFER TO EDIT
    setKoreograferToEditRedux: (
      state,
      action: PayloadAction<KoreograferState>
    ) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setKoreografersRedux,
  addKoreografersRedux,
  updateKoreograferRedux,
  addKoreograferRedux,
  deleteKoreograferRedux,
  setKoreograferToEditRedux,
} = koreografersSlice.actions;
export default koreografersSlice.reducer;
