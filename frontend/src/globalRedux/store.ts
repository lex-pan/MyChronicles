import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/User/UserChroniclesSlice';
import UserOther from "./features/User/UserOtherSlice";
import ChronicleUpdates from "./features/Chronicles/ChronicleUpdateSlice";
import SearchQueries from "./features/Chronicles/ChroniclesQuerySlice";
import { UserChronicleReduxInterface } from "./features/User/UserChroniclesSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

const userChroniclesPersistConfig = {
    key: 'userChroniclesChanges',
    storage,
    whitelist: ['listOfChanges', 'sortByChanges'], // Only persist the specified fields
};

export const makeStore = () => {
    let store: any =  configureStore({
        reducer: {
            SearchQueries: SearchQueries,
            ChronicleUpdates: ChronicleUpdates,
            UserOther: UserOther,
            UserChronicles: persistReducer<UserChronicleReduxInterface>(userChroniclesPersistConfig, UserChronicles)
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    }) 
    store.___persistor = persistStore(store);
    return store
}

// type of makestore
export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>; 
export type AppDispatch = AppStore['dispatch'];
