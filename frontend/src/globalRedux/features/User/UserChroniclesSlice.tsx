'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";

interface UserChronicleReduxInterface {
  userChronicles: Record<string, UserChronicle>;
  loggedIn: boolean;
  username: string;
  listOfChanges: Record<string, any>;
}

const initialState : UserChronicleReduxInterface = {
    userChronicles: {},
    loggedIn: false,
    username: "",
    listOfChanges: {}
}

export const UserChroniclesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    setUCchanges: (state, action: PayloadAction<Record<string, any>>) => {
        state.listOfChanges = action.payload;
    },
    applyUCchanges: (state, action: PayloadAction<Record<string, UserChronicle>>) => {
        state.userChronicles = action.payload;
        state.listOfChanges = {};
    },
    logout: (state) => {
      state.loggedIn = false;
      state.username = "";
      state.userChronicles = {};
      state.listOfChanges = {};
    },
    login: (state, action: PayloadAction<{username: string, userChronicles: Record<string, UserChronicle>}>) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.userChronicles = action.payload.userChronicles;
      state.listOfChanges = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUserChronicles.fulfilled, 
        (state : UserChronicleReduxInterface, action: PayloadAction<{username: string, userChronicles: Record<string, UserChronicle>}>) => {
            state.loggedIn = true;
            state.username = action.payload.username;
            state.userChronicles = action.payload.userChronicles;
        }
      )
      .addMatcher(
      (action) => action.type === initializeUserChronicles.fulfilled.type && typeof action.payload === 'string',
      (state) => {
        // Handle unexpected payload type here
        state.loggedIn = false;
        state.username = "";
        state.userChronicles = {};
      }
    );
  }
})

export const initializeUserChronicles = createAsyncThunk(
  "UserChronicles/loginStatusAndRetrieve",
  async () => {
    const response = await fetch(`http://localhost:5172/user/chronicles`, {
      method: 'GET',
      credentials: 'include', // Include cookies with the request
      headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    });
  
    return response.json();
  }
);

export const { setUCchanges, applyUCchanges, logout, login } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;