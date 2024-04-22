type Props = {
    chronicles: {title: string; rating: number, start_date: Date, last_read: Date, img_src: string, notes: string}[];
}

export default function ChronicleCategoryLayout(statusTypes: string[], chronicles: Props[]) {

    return ( 
        <div className='user-chronicles-container'>            
            {statusTypes.map((title, index) => (
                <div key={index}>
                    <h1>{title}</h1>
                    {chronicles[index].chronicles.map((item, i) => (
                        <div key={i}>
                            < img src={item.img_src} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
  