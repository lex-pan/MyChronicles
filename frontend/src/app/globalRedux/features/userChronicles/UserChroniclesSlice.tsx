'use client';

import { createSlice } from "@reduxjs/toolkit";
import { UserchronicleFetch } from "@/app/utils/interfaces";

const initialState : UserchronicleFetch = {
    value: [],
    viewers_username: "",
    userName: ""
}

export const UserChroniclesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    retrieveData: (state, action) => {
        state.value = action.payload.value;
        state.viewers_username = action.payload.viewers_username;
        state.userName = action.payload.userName;
    },
    applyUCchanges: (state, action) => {
        state.value = action.payload;
    },
    viewerLogOut: (state) => {
        state.viewers_username == "";
    }
  }  
})

export const { retrieveData, applyUCchanges, viewerLogOut } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;