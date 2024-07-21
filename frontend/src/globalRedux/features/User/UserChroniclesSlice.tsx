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
    listOfChanges: {},
}
// combineUnappliedAndToDb
// clearToDbChanges

export const UserChroniclesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    updateExistingId: (state, action: PayloadAction<{id: string, chronicleDetail: string, changedAttributeValue: string | null}>) => {
      state.listOfChanges[action.payload.id] = { ...state.listOfChanges[action.payload.id], [action.payload.chronicleDetail]: action.payload.changedAttributeValue } 
      state.userChronicles[action.payload.id][action.payload.chronicleDetail] = action.payload.changedAttributeValue;
    },
    updateNewId: (state, action: PayloadAction<{id: string, chronicleDetail: string, changedAttributeValue: string | null}>) => {
      state.listOfChanges[action.payload.id] = { [action.payload.chronicleDetail]: action.payload.changedAttributeValue } 
      state.userChronicles[action.payload.id][action.payload.chronicleDetail] = action.payload.changedAttributeValue;
    },
    clearChanges: (state) => {
      state.listOfChanges= {};
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

export const { updateExistingId, updateNewId, clearChanges, logout, login } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;