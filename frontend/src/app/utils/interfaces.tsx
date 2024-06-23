import { Dispatch, SetStateAction } from "react";

export interface UserChronicleData {
    userChronicleId: number,
    bookId: number,
    title: string;
    rating: number;
    start_date: string;
    last_read: string;
    episode: number;
    img_src: string;
    notes: string;
    review: string; 
    category: string;
    status: string;
}

export interface UserChronicleProps {
    item: UserChronicleData;
    removeChronicle: (userChronicleId : number) => void;
    listOfChanges : Record<number, any>;
}

export interface StatusContainerProps {
    status: string,
    chroniclesStatus: Array<UserChronicleData>
    chronicles: Record<number, UserChronicleData>
    listOfChanges : Record<number, any>;
}

export interface AddChronicleInfo {
    chronicle_id: number,
    title: string,
    category: string
    year: string
}

export interface SearchedChronicle {   
    searched_chronicle : AddChronicleInfo
}

export interface searchChroniclePageProps {
    toggle: () => void;
}