export default function AddChroniclesPage() {
    /*
    interface AddChronicleInfo {
    chronicle_id: number,
    title: string,
    creation_date: Date
}
    */

    // call api to retrieve results 
    let searchResults : Record<number, AddChronicleInfo> = {
        67: {
            chronicle_id: 67, 
            title: "book 1",
            category: "Novel",
            creation_date: "2024-04-03"
        }, 
        33: {
            chronicle_id: 33, 
            title: "book 2",
            category: "Novel",
            creation_date: "2024-04-03"
        }, 
        95: {
            chronicle_id: 95, 
            title: "some comic",
            category: "Graphic Novel",
            creation_date: "2024-04-03"
        }, 
        109: {
            chronicle_id: 109, 
            title: "show 1",
            category: "Show",
            creation_date: "2024-04-03"
        }, 
        86: {
            chronicle_id: 86, 
            title: "film 1",
            category: "Film",
            creation_date: "2024-04-03"
        }, 
        28: {
            chronicle_id: 28, 
            title: "comic 2",
            category: "Graphic Novel",
            creation_date: "2024-04-03"
        }, 
        49: {
            chronicle_id: 49, 
            title: "show 30",
            category: "Show",
            creation_date: "2024-04-03"
        }
    }

    return ( 
        <div className='add-chronicles-page'>
            <div className='add-chronicles-options'>
                <input className='add-chronicles-search' placeholder='search bar'></input>
            </div>
            <div className='add-chronicles-section-container'>
                <div className='add-chronicles-section'>
                    <h1>Novels/Graphic Novels</h1>
                    <div className='add-section-attributes'>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Year</p>
                    </div>
                    <div className='add-chronicles-content'>
                    </div>    
                </div>
                <div className='add-chronicles-section'>
                    <h1>Films/Shows</h1>
                    <div className='add-section-attributes'>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Year</p>
                    </div>
                    <div className='add-chronicles-content'>
                    </div>    
                </div>
            </div>
        </div>
    );
}
  