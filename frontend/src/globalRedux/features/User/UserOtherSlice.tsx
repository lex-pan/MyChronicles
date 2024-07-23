'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";

interface UserOtherReduxInterface {
  bioChanges: string;
}

const initialState : UserOtherReduxInterface = {
    bioChanges: "",
}

export const UserOtherSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    updateBio: (state, action: PayloadAction<string>) => {
      state.bioChanges = action.payload;
    },
  }
})

export const { updateBio } = UserOtherSlice.actions;

export default UserOtherSlice.reducer;