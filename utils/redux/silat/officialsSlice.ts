import { reduceData } from "@/utils/admin/adminFunctions";
import { compare } from "@/utils/functions";
import {
  OfficialState,
  officialInitialValue,
} from "@/utils/silat/official/officialConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: OfficialState[];
  registered: OfficialState[];
  toEdit: OfficialState;
};

const initialState: State = {
  all: [],
  registered: [],
  toEdit: officialInitialValue,
};

const officialsSlice = createSlice({
  name: "officials",
  initialState,
  reducers: {
    // SET OFFFICIAL
    setOfficialsRedux: (state, action: PayloadAction<OfficialState[]>) => {
      state.registered = action.payload.sort(compare("nama", "asc"));
    },
    // ADD OFFICIALS
    addOfficialsRedux: (state, action: PayloadAction<OfficialState[]>) => {
      state.registered = action.payload;
      const newOfficials = reduceData([...state.all, ...action.payload]).sort(
        compare("waktuPendaftaran", "desc")
      ) as OfficialState[];
      state.all = newOfficials;
    },
    // UPDATE OFFICIAL
    updateOfficialRedux: (state, action: PayloadAction<OfficialState>) => {
      const official = action.payload;

      let newOfficials = [...state.registered];
      newOfficials = newOfficials.filter((item) => item.id != official.id);
      newOfficials.push(official);
      state.registered = newOfficials.sort(compare("nama", "asc"));
    },
    // ADD OFFICIAL
    addOfficialRedux: (state, action: PayloadAction<OfficialState>) => {
      const official = action.payload;
      const officials = [...state.registered, official];
      state.registered = officials.sort(compare("nama", "asc"));
    },
    // DELETE OFFICIAL
    deleteOfficialRedux: (state, action: PayloadAction<OfficialState>) => {
      const official = action.payload;
      const officials = [...state.registered].filter(
        (item) => item.id != official.id
      );
      state.registered = officials.sort(compare("nama", "asc"));
    },
    // SET OFFICIAL TO EDIT
    setOfficialToEditRedux: (state, action: PayloadAction<OfficialState>) => {
      state.toEdit = action.payload;
    },
  },
});

export const {
  setOfficialsRedux,
  updateOfficialRedux,
  addOfficialRedux,
  deleteOfficialRedux,
  setOfficialToEditRedux,
  addOfficialsRedux,
} = officialsSlice.actions;
export default officialsSlice.reducer;
