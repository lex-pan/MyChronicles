'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";

interface UserOtherReduxInterface {
  bioChanges: string;
  newBio: string;
}

const initialState : UserOtherReduxInterface = {
    bioChanges: "",
    newBio: ""
}

export const UserOtherSlice = createSlice({
  name: "user-other",
  initialState,
  reducers: {
    updateBio: (state, action: PayloadAction<string>) => {
      state.bioChanges = action.payload;
      state.newBio = action.payload;
    },
    clearBioUpdate: (state) => {
      state.bioChanges = "";
    }
  }
})

export const { updateBio, clearBioUpdate } = UserOtherSlice.actions;

export default UserOtherSlice.reducer;