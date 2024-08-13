// this slice is for saving results of the chronicles that the user has updated
// although results are stored backend when saaved, the frontend won't show it 
// when the user exits the page so we have a slice to make it seem like the change has applied

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
  name: "chronicle-updates",
  initialState,
  reducers: {
    updateChronicle: (state, action: PayloadAction<allChronicleInfo>) => {
      state.changed_chronicles[action.payload.chronicle_id] = action.payload;
    }
  }
})

export const { updateChronicle } = ChronicleUpdatesSlice.actions;

export default ChronicleUpdatesSlice.reducer;