import { reduceData } from "@/utils/admin/adminFunctions";
import {
  SanggarState,
  sanggarInitialValue,
} from "@/utils/jaipong/sanggar/sanggarConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: SanggarState[];
  registered: SanggarState;
  toEdit: SanggarState;
};

const initialState: State = {
  all: [],
  registered: sanggarInitialValue,
  toEdit: sanggarInitialValue,
};

const sanggarSlice = createSlice({
  name: "sanggar",
  initialState,
  reducers: {
    // ADD SANGGARS
    addSanggarsRedux: (state, action: PayloadAction<SanggarState[]>) => {
      const newSanggars = reduceData([
        ...state.all,
        ...action.payload,
      ]) as SanggarState[];
      state.all = newSanggars;
    },
    // SET SANGGAR
    setSanggarRedux: (state, action: PayloadAction<SanggarState>) => {
      state.registered = action.payload;
    },
    // UPDATE SANGGAR
    updateSanggarRedux: (state, action: PayloadAction<SanggarState>) => {
      state.registered = action.payload;
    },
    // DELETE SANGGAR
    deleteSanggarRedux: (state) => {
      state.registered = sanggarInitialValue;
    },
    // SET SANGGAR TO EDIT
    setSanggarToEditRedux: (state, action: PayloadAction<SanggarState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setSanggarRedux,
  addSanggarsRedux,
  updateSanggarRedux,
  deleteSanggarRedux,
  setSanggarToEditRedux,
} = sanggarSlice.actions;
export default sanggarSlice.reducer;
