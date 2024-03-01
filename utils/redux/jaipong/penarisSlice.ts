import { compare } from "@/utils/functions";
import {
  PenariState,
  penariInitialValue,
} from "@/utils/jaipong/penari/penariConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: PenariState[];
  registered: PenariState[];
  toEdit: PenariState;
};

const initialState: State = {
  all: [],
  registered: [],
  toEdit: penariInitialValue,
};

const getRegistered = (state: any, data: PenariState[]) => {
  let container: PenariState[] = [];
  data.map((penari) => {
    if (penari.tarian.length) {
      penari.tarian.map((tarian) => {
        const data: PenariState = { ...penari, tarian: [tarian] };
        container.push(data);
      });
    }
  });
  state.registered = container.sort(compare("nama", "asc"));
};

const penariSlice = createSlice({
  name: "penaris",
  initialState,
  reducers: {
    // SET PENARI
    setPenarisRedux: (state, action: PayloadAction<PenariState[]>) => {
      const penaris = action.payload;
      state.all = penaris.sort(compare("nama", "asc"));
      getRegistered(state, penaris);
    },
    // UPDATE PENARI
    updatePenariRedux: (state, action: PayloadAction<PenariState>) => {
      const penari = action.payload;

      let newPenaris = [...state.all];
      newPenaris = newPenaris.filter((item) => item.id != penari.id);
      newPenaris.push(penari);
      state.all = newPenaris.sort(compare("nama", "asc"));
      getRegistered(state, newPenaris);
    },
    // ADD PENARI
    addPenariRedux: (state, action: PayloadAction<PenariState>) => {
      const penari = action.payload;
      const penaris = [...state.all, penari];
      state.all = penaris.sort(compare("nama", "asc"));
      getRegistered(state, penaris);
    },
    // DELETE PENARI
    deletePenariRedux: (state, action: PayloadAction<PenariState>) => {
      const penari = action.payload;
      const penaris = [...state.all].filter((item) => item.id != penari.id);
      state.all = penaris.sort(compare("nama", "asc"));
      getRegistered(state, penaris);
    },
    // SET PENARI TO EDIT
    setPenariToEditRedux: (state, action: PayloadAction<PenariState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setPenarisRedux,
  updatePenariRedux,
  addPenariRedux,
  deletePenariRedux,
  setPenariToEditRedux,
} = penariSlice.actions;
export default penariSlice.reducer;
