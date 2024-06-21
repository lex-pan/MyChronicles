interface UserChronicle {
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

interface UserChronicleProps {
    item: UserChronicle;
    removeChronicle: (userChronicleId : number) => void;
    listOfChanges : Record<number, any>;
}

interface StatusContainerProps {
    status: string,
    chroniclesStatus: Array<UserChronicle>
    chronicles: Record<number, UserChronicle>
    listOfChanges : Record<number, any>;
}

interface AddChronicleInfo {
    chronicle_id: number,
    title: string,
    category: string
    year: string
}

interface SearchedChronicle {   
    searched_chronicle : AddChronicleInfo
}