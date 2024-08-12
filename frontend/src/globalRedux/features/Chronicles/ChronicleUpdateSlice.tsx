'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { allChronicleInfo } from "@/app/utils/interfaces";

interface updatedChronices {
  changed_chronicles: Record<string, allChronicleInfo>
}

const initialState : updatedChronices = {
  changed_chronicles: {}
}

export const ChronicleUpdatesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    updateChronicle: (state, action: PayloadAction<allChronicleInfo>) => {
      state.changed_chronicles[action.payload.chronicle_id] = action.payload;
    }
  }
})

export const { updateChronicle } = ChronicleUpdatesSlice.actions;

export default ChronicleUpdatesSlice.reducer;