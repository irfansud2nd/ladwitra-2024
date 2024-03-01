import {
  SanggarState,
  sanggarInitialValue,
} from "@/utils/jaipong/sanggar/sanggarConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  registered: SanggarState;
  toEdit: SanggarState;
};

const initialState: State = {
  registered: sanggarInitialValue,
  toEdit: sanggarInitialValue,
};

const sanggarSlice = createSlice({
  name: "sanggar",
  initialState,
  reducers: {
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
  updateSanggarRedux,
  deleteSanggarRedux,
  setSanggarToEditRedux,
} = sanggarSlice.actions;
export default sanggarSlice.reducer;
