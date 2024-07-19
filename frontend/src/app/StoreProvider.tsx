'use client';

import { useRef } from 'react'
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../globalRedux/store";
import { initializeUserChronicles } from '@/globalRedux/features/User/UserChroniclesSlice';

export default function StoreProvider({ children } : Readonly<{
    children: React.ReactNode;
}>) {
    const storeRef = useRef<AppStore | null>(null)
    if (!storeRef.current) {
      // Create the store instance the first time this renders
      storeRef.current = makeStore();
      storeRef.current.dispatch(initializeUserChronicles());
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}