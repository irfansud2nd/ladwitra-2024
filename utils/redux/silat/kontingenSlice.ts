import {
  KontingenState,
  kontingenInitialValue,
} from "@/utils/silat/kontingen/kontingenConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  registered: KontingenState;
  toEdit: KontingenState;
};

const initialState: State = {
  registered: kontingenInitialValue,
  toEdit: kontingenInitialValue,
};

const kontingenSlice = createSlice({
  name: "kontingen",
  initialState,
  reducers: {
    // SET KONTINGEN
    setKontingenRedux: (state, action: PayloadAction<KontingenState>) => {
      state.registered = action.payload;
    },
    // UPDATE KONTINGEN
    updateKontingenRedux: (state, action: PayloadAction<KontingenState>) => {
      state.registered = action.payload;
    },
    // DELETE KONTINGEN
    deleteKontingenRedux: (state) => {
      state.registered = kontingenInitialValue;
    },
    // SET KONTINGEN TO EDIT
    setKontingenToEditRedux: (state, action: PayloadAction<KontingenState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setKontingenRedux,
  updateKontingenRedux,
  deleteKontingenRedux,
  setKontingenToEditRedux,
} = kontingenSlice.actions;
export default kontingenSlice.reducer;
