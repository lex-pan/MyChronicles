export interface UserChronicleData {
    username: string;
    user_chronicles: Array<UserChronicle>;
    viewers_username: string;
}

export interface UserChronicle {
    book_id: string;
    book_name: string;
    entertainment_category: string;
    episode: number;
    last_read: string;
    rating: number;
    status: string;
}

export interface UserChronicleProps {
    item: UserChronicle;
    confirmDelete: (userChronicleId : number) => void;
    listOfChanges : Record<number, any>;
}

export interface StatusContainerProps {
    status: string;
    chroniclesStatus: Array<UserChronicleData>;
    listOfChanges : Record<number, any>;
    confirmDelete: (userChronicleId : number) => void;
}

export interface AddChronicleInfo {
    chronicle_id: number;
    title: string;
    category: string;
    year: string;
}

export interface SearchedChronicle {   
    searched_chronicle : AddChronicleInfo;
}

export interface searchChroniclePageProps {
    toggle: () => void;
}

export interface SearchedChronicleInfo {
    chronicle_id: number;
    title: string;
    rating: number;
    members: number;
    category: string;
    date: string;
}

export interface SearchedChronicleInfoProps {
    chronicle: SearchedChronicleInfo;
}

export interface UserReview {
    user_review_id: number;
    username: string;
    rating: number;
    review: string;
}

export interface ReviewProps {
    review_data: UserReview;
}

export interface UserchronicleFetch {
    value: Array<UserChronicle>;
    viewers_username: string;
    userName: string;
}