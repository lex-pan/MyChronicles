import { configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/User/UserChroniclesSlice';
import UserLoginStatus from './features/User/UserLoginSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            UserChronicles: UserChronicles,
            UserLoginStatus: UserLoginStatus,
        }
    }) 
}

// type of makestore
export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>; 
export type AppDispatch = AppStore['dispatch'];