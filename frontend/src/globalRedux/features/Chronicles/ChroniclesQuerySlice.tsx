// this slice is to save the query results of the search page
// when a user clicks on a chronicle in the search page
// the contents of the search disappears when they go back

'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { GeneralSearchedChronicleInfo } from "@/app/utils/interfaces";

interface QueriedChronicles {
  queried_chronicles: Array<GeneralSearchedChronicleInfo> | null
}

const initialState : QueriedChronicles = {
  queried_chronicles: null
}

export const SearchQueriesSlice = createSlice({
  name: "queried-chronicles",
  initialState,
  reducers: {
    saveSearchQueries: (state, action: PayloadAction<Array<GeneralSearchedChronicleInfo>>) => {
      state.queried_chronicles = action.payload;
    }
  }
})

export const { saveSearchQueries } = SearchQueriesSlice.actions;

export default SearchQueriesSlice.reducer;