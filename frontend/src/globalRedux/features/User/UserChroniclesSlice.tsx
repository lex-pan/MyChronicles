'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserChronicle, UserchronicleFetch } from "@/app/utils/interfaces";

interface UserChronicleValue {
  value: Array<UserChronicle>;
}

const initialState : UserChronicleValue = {
    value: [],
    //loggedIn: false,
    //username: ""
}

export const UserChroniclesSlice = createSlice({
  name: "user-chronicles",
  initialState,
  reducers: {
    setUC: (state, action: PayloadAction<Array<UserChronicle>>) => {
        state.value = action.payload;
    },
    applyUCchanges: (state, action) => {
        state.value = action.payload;
    },
  }  
})

export const initializeUserChronicles = createAsyncThunk(
  "UserChronicles/retrieve",
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

export const initializeLogin = createAsyncThunk(
  "userLogin/userStatus",
  async () => {
    const request = await fetch('http://localhost:5172/user/login-status', {
      method: 'GET',
      credentials: 'include', // Include cookies with the request
    });
    
    const isLoggedIn = await request.text();
    return isLoggedIn;
  }
);

export const { setUC, applyUCchanges } = UserChroniclesSlice.actions;

export default UserChroniclesSlice.reducer;