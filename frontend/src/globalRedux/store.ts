import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserChronicles from './features/User/UserChroniclesSlice';
import UserOther from "./features/User/UserOtherSlice";
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
import { UserChronicle } from "@/app/utils/interfaces";

const persistConfig = {
    key: 'root', // defines the key which the persisted state will be stored in localstorage
    storage, //specifies the storage engine used such as local, session, or custom
    whitelist: ['UserChronicles'] // Persist only the UserChronicles reducer
};

const userChroniclesPersistConfig = {
    key: 'userChroniclesChanges',
    storage,
    whitelist: ['listOfChanges'], // Only persist the specified fields
};

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

export const makeStore = () => {
    let store: any =  configureStore({
        reducer: {
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
