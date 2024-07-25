export interface UserChronicleData {
    profileUsername: string;
    ssProfileUC: Record<string, UserChronicle> | undefined;
    profileExists: boolean
}

export interface UserChronicle {
    [key: string]: string | number | boolean | null | UserChronicle; // Allow additional properties
    book_id: string;
    book_name: string;
    entertainment_category: string;
    episode: number | null;
    last_read: string;
    rating: number | null;
    userChronicleForDelete: UserChronicle | null;
    status: string;
}

export interface UserChronicleProps {
    item: UserChronicle;
    confirmDelete: (userChronicleForDelete: UserChronicle | null) => void;
    profileUsername: string;
    profileUC: Record<string, UserChronicle> | undefined;
}

export interface StatusContainerProps {
    status: string;
    chroniclesStatus: Record<string, UserChronicle>;
    confirmDelete: (userChronicleForDelete: UserChronicle | null) => void;
    profileUsername : string;
    profileUC: Record<string, UserChronicle> | undefined;
}

export interface AddChronicleInfo {
    chronicle_id: number;
    chronicle_title: string;
    entertainment_category: string;
    year: string;
    country: string;
    creator: string;
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
    convertedUC: Record<string, UserChronicle>;
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

export interface UserProfileHistoryItem {
    title: string;
    action: string;
    occurence: string;
    episode: number;
}

export interface UserProfileFetch {
    last_online: string;
    date_joined: string;
    watched_or_read: number;
    avg_rating: number | null;
    bio: string;
    user_history: Array<UserProfileHistoryItem>;
}