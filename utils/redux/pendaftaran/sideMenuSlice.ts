import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  normal: boolean;
  mobile: boolean;
};

const initialState: State = {
  normal: true,
  mobile: false,
};

const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    // SET SIDE MENU
    setSideMenu: (state, action: PayloadAction<boolean>) => {
      state.normal = action.payload;
    },
  },
});

export const { setSideMenu } = sideMenuSlice.actions;
export default sideMenuSlice.reducer;
