import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/User/UserChroniclesSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root', // defines the key which the persisted state will be stored in localstorage
    storage, //specifies the storage engine used such as local, session, or custom
    whitelist: ['UserChronicles'] // Persist only the UserChronicles reducer
};

const userChroniclesPersistConfig = {
    key: 'userChroniclesChanges',
    storage,
    whitelist: ['unappliedChanges', 'changesToDb'], // Only persist the specified fields
};

export const makeStore = () => {
    let store: any =  configureStore({
        reducer: {
            UserChronicles: persistReducer(userChroniclesPersistConfig, UserChronicles)
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
    }) 
    store.___persistor = persistStore(store);
    return store
}

// type of makestore
export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>; 
export type AppDispatch = AppStore['dispatch'];