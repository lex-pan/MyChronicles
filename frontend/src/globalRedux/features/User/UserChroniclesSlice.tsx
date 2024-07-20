'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";
import { act } from "react-dom/test-utils";

interface UserChronicleReduxInterface {
  userChronicles: Record<string, UserChronicle>;
  loggedIn: boolean;
  username: string;
  unappliedChanges: Record<string, any>;
  changesToDb: Record<string, any>;
}

const initialState : UserChronicleReduxInterface = {
    userChronicles: {},
    loggedIn: false,
    username: "",
    unappliedChanges: {},
    changesToDb: {}
}

export const UserChroniclesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    updateExistingId: (state, action: PayloadAction<{id: string, chronicleDetail: string, changedAttributeValue: string | null}>) => {
      state.unappliedChanges[action.payload.id] = { ...state.unappliedChanges[action.payload.id], [action.payload.chronicleDetail]: action.payload.changedAttributeValue } 
    },
    updateNewId: (state, action: PayloadAction<{id: string, chronicleDetail: string, changedAttributeValue: string | null}>) => {
      state.unappliedChanges[action.payload.id] = { [action.payload.chronicleDetail]: action.payload.changedAttributeValue } 
    },
    deleteRedundantEdit: (state, action: PayloadAction<{id: string, chronicleDetail: string}>) => {
      delete state.unappliedChanges[action.payload.id][action.payload.chronicleDetail];
      if (Object.keys(state.unappliedChanges[action.payload.id]).length == 0) {
        delete state.unappliedChanges[action.payload.id];
      }
    },
    logout: (state) => {
      state.loggedIn = false;
      state.username = "";
      state.userChronicles = {};
      state.unappliedChanges = {};
      state.changesToDb = {}; 
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

export const { updateExistingId, updateNewId, deleteRedundantEdit, logout, login } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;