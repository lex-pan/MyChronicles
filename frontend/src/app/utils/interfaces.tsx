interface Chronicle {
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
    item: Chronicle;
    removeChronicle: (userChronicleId : number) => void;
}

interface StatusContainerProps {
    status: string,
    chroniclesStatus: Array<Chronicle>
    chronicles: Record<number, Chronicle>
}