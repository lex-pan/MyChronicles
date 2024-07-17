'use client';

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loginStatus } from "@/app/utils/interfaces";

const initialState : loginStatus = {
    loggedIn: false,
    username: ""
}

export const loginStatusSlice = createSlice({
    name: "login-status",
    initialState,
    reducers: {
      setLoginStatus: (state, action: PayloadAction<{loggedIn: boolean, username: string}>) => {
        console.log(action);
          state.loggedIn = action.payload.loggedIn;
          state.username = action.payload.username;
      },
    },
      extraReducers: (builder) => {
        builder
          .addCase(initializeLogin.fulfilled, 
            (state, action: PayloadAction<string>) => {
              if (action.payload != "false" ) {
                state.loggedIn = true;
                state.username = action.payload;
              }
            }
          );
      }
  })
  
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

export const { setLoginStatus } = loginStatusSlice.actions;

export default loginStatusSlice.reducer;

