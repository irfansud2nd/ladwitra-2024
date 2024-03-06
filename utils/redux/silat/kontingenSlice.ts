import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  KontingenState,
  kontingenInitialValue,
} from "@/utils/silat/kontingen/kontingenConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: KontingenState[];
  registered: KontingenState;
  toEdit: KontingenState;
};

const initialState: State = {
  all: [],
  registered: kontingenInitialValue,
  toEdit: kontingenInitialValue,
};

const kontingenSlice = createSlice({
  name: "kontingen",
  initialState,
  reducers: {
    // ADD KONTINGENS
    addKontingensRedux: (state, action: PayloadAction<KontingenState[]>) => {
      const newKontingens = reduceData([...state.all, ...action.payload]).sort(
        compare("waktuPendaftaran", "desc")
      ) as KontingenState[];
      state.all = newKontingens;
    },
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
  addKontingensRedux,
  setKontingenRedux,
  updateKontingenRedux,
  deleteKontingenRedux,
  setKontingenToEditRedux,
} = kontingenSlice.actions;
export default kontingenSlice.reducer;
