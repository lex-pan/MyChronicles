'use client';

import { configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/userChronicles/UserChroniclesSlice'

export const store = configureStore({
    reducer: {
        UClistChange: UserChronicles
    }
})

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch;