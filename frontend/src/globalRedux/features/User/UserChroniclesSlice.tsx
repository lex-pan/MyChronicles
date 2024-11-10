'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";
import apiLink from '@/app/utils/apiLink';

export interface UserChronicleReduxInterface {
  userChronicles: Record<string, UserChronicle>;
  loggedIn: boolean;
  username: string;
  listOfChanges: Record<string, any>;
  primarySortBy: string;
  secondarySortBy: string;
  sortByChanges: Record<string, string>;
}

const initialState : UserChronicleReduxInterface = {
    userChronicles: {},
    loggedIn: false,
    username: "",
    listOfChanges: {},
    primarySortBy: "status",
    secondarySortBy: "none",
    sortByChanges: {}
}

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
      state.listOfChanges = {};
      state.sortByChanges = {};
    },
    deleteUC: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload != null) {
        delete state.userChronicles[action.payload];
      } 
    },
    addUC: (state, action: PayloadAction<{id: string, newUC: UserChronicle}>) => {
      state.userChronicles[action.payload.id] = action.payload.newUC; 
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
    },
    updateSort: (state, action: PayloadAction<{sortType: string, sortValue: string}>) => {
      if (action.payload.sortType == "primary") {
        state.primarySortBy = action.payload.sortValue;
      } else {
        state.secondarySortBy = action.payload.sortValue;
      }
      state.sortByChanges[action.payload.sortType] = action.payload.sortValue;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUserChronicles.fulfilled, 
        (state : UserChronicleReduxInterface, action: PayloadAction<{username: string, userChronicles: Record<string, UserChronicle>, primarySortBy: string, secondarySortBy: string} | string>) => {
          if (typeof action.payload != "string") {
            state.loggedIn = true;
            state.username = action.payload.username;
            state.userChronicles = action.payload.userChronicles;
            state.primarySortBy = action.payload.primarySortBy ?? "status";
            state.secondarySortBy = action.payload.secondarySortBy ?? "none";
          }  
        }
      )
  }
})

export const initializeUserChronicles = createAsyncThunk(
  "UserChronicles/loginStatusAndRetrieve",
  async () => {
    const response = await fetch(`${apiLink}/user/chronicles`, {
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

export const { updateExistingId, updateNewId, addUC, deleteUC, clearChanges, logout, login, updateSort } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;