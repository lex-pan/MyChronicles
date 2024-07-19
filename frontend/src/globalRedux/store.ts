import { configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/User/UserChroniclesSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            UserChronicles: UserChronicles,
        }
    }) 
}

// type of makestore
export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>; 
export type AppDispatch = AppStore['dispatch'];