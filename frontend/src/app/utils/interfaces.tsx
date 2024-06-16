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
    UserChronicleId: number;
    item: Chronicle;
}