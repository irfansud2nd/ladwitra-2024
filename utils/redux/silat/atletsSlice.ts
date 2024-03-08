import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  AtletState,
  atletInitialValue,
} from "@/utils/silat/atlet/atletConstats";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FilteredAtlets = {
  idPertandingan: string;
  atlets: AtletState[];
};

type State = {
  filtered: FilteredAtlets[];
  all: AtletState[];
  registered: AtletState[];
  toEdit: AtletState;
  pertandinganToEdit: AtletState;
};

const initialState: State = {
  filtered: [],
  all: [],
  registered: [],
  toEdit: atletInitialValue,
  pertandinganToEdit: atletInitialValue,
};

const getRegistered = (state: State, data: AtletState[]) => {
  let result: AtletState[] = [];
  data.map((atlet) => {
    if (atlet.pertandingan.length) {
      atlet.pertandingan.map((pertandingan) => {
        const data: AtletState = { ...atlet, pertandingan: [pertandingan] };
        result.push(data);
      });
    }
  });
  state.registered = result.sort(compare("nama", "asc"));
};

const getFiltered = (state: State, atlets: AtletState[]) => {
  atlets.map((atlet) => {
    atlet.pertandingan.map((pertandingan) => {
      const idPertandingan = `${pertandingan.jenis}/${pertandingan.tingkatan}/${pertandingan.kategori}/${atlet.jenisKelamin}`;
      const exist = state.filtered.find(
        (item) => item.idPertandingan == idPertandingan
      );
      if (exist) {
        const newAtlets = reduceData([...exist.atlets, atlet]) as AtletState[];
        state.filtered = reduceData([
          ...state.filtered,
          { idPertandingan, atlets: newAtlets },
        ]) as FilteredAtlets[];
      } else {
        state.filtered = [
          ...state.filtered,
          { idPertandingan, atlets: [atlet] },
        ];
      }
    });
  });
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
    // ADD ATLETS
    addAtletsRedux: (state, action: PayloadAction<AtletState[]>) => {
      const newAtlets = reduceData([...state.all, ...action.payload]).sort(
        compare("waktuPendaftaran", "desc")
      ) as AtletState[];
      state.all = newAtlets;
      getFiltered(state, newAtlets);
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
    // SET PERTANDINGAN TO EDIT
    setPertandinganToEditRedux: (state, action: PayloadAction<AtletState>) => {
      state.pertandinganToEdit = action.payload;
    },
  },
});

export const {
  setAtletsRedux,
  addAtletsRedux,
  updateAtletRedux,
  addAtletRedux,
  deleteAtletRedux,
  setAtletToEditRedux,
  setPertandinganToEditRedux,
} = atletSlice.actions;
export default atletSlice.reducer;
