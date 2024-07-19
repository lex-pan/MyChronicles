export interface UserChronicleData {
    profileUsername: string;
    ssProfileUC: Record<string, UserChronicle>;
}

export interface UserChronicle {
    book_id: string;
    book_name: string;
    entertainment_category: string;
    episode: number;
    last_read: string;
    rating: number;
    userChronicleForDelete: UserChronicle | null;
    status: string;
}

export interface UserChronicleProps {
    item: UserChronicle;
    confirmDelete: (userChronicleForDelete: UserChronicle | null) => void;
    listOfChanges : Record<string, any>;
    profileUsername: string;
}

export interface StatusContainerProps {
    status: string;
    chroniclesStatus: Record<string, UserChronicle>;
    listOfChanges : Record<string, any>;
    confirmDelete: (userChronicleForDelete: UserChronicle | null) => void;
    profileUsername : string;
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
    value: Record<string, UserChronicle>;
    viewers_username: string;
    userName: string;
}

export interface AdditionalInfoUC {
    review: string;
    start_date: string;
    notes: string;
}

export interface loginStatus {
    loggedIn: boolean;
    username: string;
}