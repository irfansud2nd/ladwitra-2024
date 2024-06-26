import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  PenariState,
  penariInitialValue,
} from "@/utils/jaipong/penari/penariConstants";
import { getTarianId } from "@/utils/jaipong/penari/penariFunctions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type FilteredPenaris = {
  idTarian: string;
  penaris: PenariState[];
};

type State = {
  filtered: FilteredPenaris[];
  all: PenariState[];
  registered: PenariState[];
  toEdit: PenariState;
  tarianToEdit: PenariState;
};

const initialState: State = {
  filtered: [],
  all: [],
  registered: [],
  toEdit: penariInitialValue,
  tarianToEdit: penariInitialValue,
};

const getRegistered = (state: any, data: PenariState[]) => {
  let result: PenariState[] = [];
  data.map((penari) => {
    let lagu = penari.lagu;
    let namaTim = penari.namaTim;
    if (penari.tarian.length) {
      penari.tarian.map((tarian) => {
        const idTarian = getTarianId(tarian);

        let data: PenariState = {
          ...penari,
          tarian: [tarian],
          lagu: [],
          namaTim: [],
        };

        if (tarian.jenis == "Tunggal") {
          const tarianLagu = lagu.find((item) => item.idTarian == idTarian);

          if (tarianLagu) {
            data = { ...data, lagu: [tarianLagu] };
            lagu = lagu.filter((item) => item != tarianLagu);
          }
        }

        if (tarian.jenis == "Rampak") {
          const tarianNamaTim = namaTim.find(
            (item) => item.idTarian == idTarian
          );

          if (tarianNamaTim) {
            data = { ...data, namaTim: [tarianNamaTim] };

            namaTim = namaTim.filter((item) => item != tarianNamaTim);
          }
        }

        result.push(data);
      });
    }
  });
  state.registered = result.sort(compare("nama", "asc"));
};

const getFiltered = (state: State, penaris: PenariState[]) => {
  penaris.map((penari) => {
    penari.tarian.map((tarian) => {
      const idTarian = `${tarian.jenis}/${tarian.kelas}/${tarian.tingkatan}/${tarian.kategori}/${penari.jenisKelamin}`;
      const exist = state.filtered.find((item) => item.idTarian == idTarian);
      if (exist) {
        const newPenaris = reduceData([
          ...exist.penaris,
          penari,
        ]) as PenariState[];
        state.filtered = reduceData([
          ...state.filtered,
          { idTarian, penaris: newPenaris },
        ]) as FilteredPenaris[];
      } else {
        state.filtered = [...state.filtered, { idTarian, penaris: [penari] }];
      }
    });
  });
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
    // ADD PENARIS
    addPenarisRedux: (state, action: PayloadAction<PenariState[]>) => {
      const newPenaris = reduceData([...state.all, ...action.payload]).sort(
        compare("waktuPendaftaran", "desc")
      ) as PenariState[];
      state.all = newPenaris;
      getFiltered(state, newPenaris);
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
    // SET TARIAN TO EDIT
    setTarianToEditRedux: (state, action: PayloadAction<PenariState>) => {
      state.tarianToEdit = action.payload;
    },
  },
});

export const {
  setPenarisRedux,
  addPenarisRedux,
  updatePenariRedux,
  addPenariRedux,
  deletePenariRedux,
  setPenariToEditRedux,
  setTarianToEditRedux,
} = penariSlice.actions;
export default penariSlice.reducer;
