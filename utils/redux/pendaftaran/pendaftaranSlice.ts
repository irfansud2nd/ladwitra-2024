import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  jaipongLimit: number;
  silatLimit: number;
};

const initialState: State = {
  jaipongLimit: 0,
  silatLimit: 0,
};

const pendaftaranSlice = createSlice({
  name: "pendaftaran",
  initialState,
  reducers: {
    setJaipongLimit: (state, action: PayloadAction<number>) => {
      state.jaipongLimit = action.payload;
    },
    setSilatLimit: (state, action: PayloadAction<number>) => {
      state.silatLimit = action.payload;
    },
  },
});

export const { setJaipongLimit, setSilatLimit } = pendaftaranSlice.actions;
export default pendaftaranSlice.reducer;
