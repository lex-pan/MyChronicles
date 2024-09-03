import { Dispatch, SetStateAction } from 'react';

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
    chronicle_id: string;
    chronicle_title: string;
    entertainment_category: string;
    year: string;
    country: string;
    creator: string;
}

export interface SearchedChronicle { 
    searched_chronicle : AddChronicleInfo;
    setCategorizedChronicles: Dispatch<SetStateAction<Record<string, UserChronicle>[] | undefined>>;
    sortByStatus: (filteredChronicles: Record<string, UserChronicle>) => Array<Record<string, UserChronicle>>;
    profileUC: Record<string, UserChronicle> | undefined;
}

export interface searchChroniclePageProps {
    toggle: () => void;
    setCategorizedChronicles: Dispatch<SetStateAction<Record<string, UserChronicle>[] | undefined>>;
    sortByStatus: (filteredChronicles: Record<string, UserChronicle>) => Array<Record<string, UserChronicle>>;
    profileUC: Record<string, UserChronicle> | undefined;
}

export interface SearchedChronicleInfo {
    chronicle_id: string;
    title: string;
    rating: number;
    members: number;
    category: string;
    date: string;
}

export interface GeneralSearchedChronicleInfo {
    chronicle_id: string;
    chronicle_title: string;
    country: string;
    creator: string;
    rating: number;
    members: number;
    entertainment_category: string;
    episodes: number;
    status: string;
    synopsis: string;
}

export interface SearchedChronicleInfoProps {
    chronicle: SearchedChronicleInfo;
}

export interface DetailedSearchChronicleInfoProps {
    chronicle: GeneralSearchedChronicleInfo;
    toggleAdd: (chronicleToAdd: GeneralSearchedChronicleInfo | null) => void;
    queriesForBack: () => void;
}

export interface UserReviews {
    username: string,
    review: string,
    rating: number,
    episodes: number,
    review_date: string
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

export interface UserHistoryData {
    title: string;
    chapter: number;
    action: string;
    date_of_action: string;
    url: string;
}

export interface ExtraSearchedChronicleInfo {
    genres: Array<string>;
    tags: Array<string>;
    alternative_titles: Array<string>;
    reviews : Array<string>;
    summary: string;
}

export interface AddChronicleOverlayProps {
    chronicle: GeneralSearchedChronicleInfo;
    toggle: (chronicleToAdd: GeneralSearchedChronicleInfo | null) => void;
}

// export default function AddChronicleOverlay({chronicle, toggle, addChronicle} : {chronicle : GeneralSearchedChronicleInfo}) {

export interface allChronicleInfo{
    chronicle_id: string;
    chronicle_title: string;
    country: string;
    creator: string;
    rating: number;
    members: number;
    entertainment_category: string;
    episodes: number;
    status: string;
    synopsis: string;
    length: string;
    start_date: string;
    end_date: string;
    genres: string[];
    tags: string[];
    other_creators: string[];
    alternative_titles: string[];
};

export interface tagsAndGenres {
    tags: string[],
    genres: string[]
}

export interface allChronicleInfoProps{
    allInfo: allChronicleInfo
};

export interface importedChronicle {
    title: string,
    category: string,
    num_episodes: string | null,
    episodes_watched: string | null,
    user_rating: string | null,
    user_start_date: string | null,
    user_last_watched: string | null,
    user_status: string | null,
    comments: string | null
}