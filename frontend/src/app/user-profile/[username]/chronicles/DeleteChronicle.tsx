import { DeleteUCprops } from "@/app/utils/interfaces";
import { useAppDispatch } from '../../../../globalRedux/hooks';
import { deleteUC } from '@/globalRedux/features/User/UserChroniclesSlice';
import apiLink from "@/app/utils/apiLink";

export default function DeleteChronicle({categorizedChronicles, chronicleStatus, setCategorizedChronicles, toggleDelete, deleteChronicleName} : DeleteUCprops) {
    const dispatch = useAppDispatch();

    async function deleteChronicle() {
        if (categorizedChronicles == undefined) {
            return
        }

        let index = 0;
        
        for (let i = 0; i < chronicleStatus.length; i++) {
            // will need a way to dynamically switch based on how it's categorized
            // we retrieve the index of the categorized array that we want to remove from
            if (chronicleStatus[i] == deleteChronicleName?.status) {
                index = i;
            }
        }   
        console.log(index);
        console.log(deleteChronicleName);
        const updatedCategorizedChronicles = categorizedChronicles.map((categoryChronicles, i) => {
            if (i === index) {
                console.log(deleteChronicleName?.book_id);
                console.log(deleteChronicleName?.book_id != null);
                if (deleteChronicleName?.book_id != null) {
                    console.log(categoryChronicles);
                    delete categoryChronicles[deleteChronicleName.book_id]
                }

                return categoryChronicles;
            }
            return categoryChronicles;
        });

        setCategorizedChronicles(updatedCategorizedChronicles);
        toggleDelete(null);

        dispatch(deleteUC(deleteChronicleName?.book_id));
        // send to db for delete
        await fetch(`${apiLink}/user/chronicles/delete/${deleteChronicleName?.book_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/text' // Example: Accept JSON responses
            },
            credentials: 'include'
        });
    }

    return(
        <div className='overlay'>
            <div className='overlay-container delete-chronicle'>
                <h1 className='overlay-container-title'>Delete {deleteChronicleName?.book_name}?</h1>
                <div className='overlay-container-button-container'>
                    <button onClick={() => toggleDelete(null)} className='no overlay-container-button'>No</button>
                    <button onClick={deleteChronicle} className='yes overlay-container-button'>Yes</button>
                </div>
            </div>
        </div>
    )
}