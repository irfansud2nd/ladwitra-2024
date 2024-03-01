import { compare } from "@/utils/functions";
import {
  AtletState,
  atletInitialValue,
} from "@/utils/silat/atlet/atletConstats";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: AtletState[];
  registered: AtletState[];
  toEdit: AtletState;
};

const initialState: State = {
  all: [],
  registered: [],
  toEdit: atletInitialValue,
};

const getRegistered = (state: any, data: AtletState[]) => {
  let container: AtletState[] = [];
  data.map((atlet) => {
    if (atlet.pertandingan.length) {
      atlet.pertandingan.map((pertandingan) => {
        const data: AtletState = { ...atlet, pertandingan: [pertandingan] };
        container.push(data);
      });
    }
  });
  state.registered = container.sort(compare("nama", "asc"));
};

const atletSlice = createSlice({
  name: "atlets",
  initialState,
  reducers: {
    // SET ATLET
    setAtletsRedux: (state, action: PayloadAction<AtletState[]>) => {
      const atlets = action.payload;
      state.all = atlets.sort(compare("nama", "asc"));
      getRegistered(state, atlets);
    },
    // UPDATE ATLET
    updateAtletRedux: (state, action: PayloadAction<AtletState>) => {
      const atlet = action.payload;

      let newAtlets = [...state.all];
      newAtlets = newAtlets.filter((item) => item.id != atlet.id);
      newAtlets.push(atlet);
      state.all = newAtlets.sort(compare("nama", "asc"));
      getRegistered(state, newAtlets);
    },
    // ADD ATLET
    addAtletRedux: (state, action: PayloadAction<AtletState>) => {
      const atlet = action.payload;
      const atlets = [...state.all, atlet];
      state.all = atlets.sort(compare("nama", "asc"));
      getRegistered(state, atlets);
    },
    // DELETE ATLET
    deleteAtletRedux: (state, action: PayloadAction<AtletState>) => {
      const atlet = action.payload;
      const atlets = [...state.all].filter((item) => item.id != atlet.id);
      state.all = atlets.sort(compare("nama", "asc"));
      getRegistered(state, atlets);
    },
    // SET ATLET TO EDIT
    setAtletToEditRedux: (state, action: PayloadAction<AtletState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setAtletsRedux,
  updateAtletRedux,
  addAtletRedux,
  deleteAtletRedux,
  setAtletToEditRedux,
} = atletSlice.actions;
export default atletSlice.reducer;
