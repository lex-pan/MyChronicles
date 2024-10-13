import { UserChronicle, MediumChangeProps } from "@/app/utils/interfaces";
import { MouseEvent } from "react";

export default function MediumChange({profileUC, sortByStatus, setCategorizedChronicles} : MediumChangeProps) {
    function mediumChange(e: MouseEvent<HTMLDivElement, Event>, index: number, medium: string) {
        cssFolderEffect(e, index);
        let filteredChronicles = filterChroniclesByMedium(medium);
        if (filteredChronicles !=  undefined) {
            let sortedChronicles = sortByStatus(filteredChronicles);
            setCategorizedChronicles(sortedChronicles);
        }
    }

    function cssFolderEffect(e: MouseEvent<HTMLDivElement, Event>, index: number) {
        const chronicleOptions = e?.currentTarget.parentNode;
        if (chronicleOptions && chronicleOptions.children) {
            for (let i = 0; i < chronicleOptions?.children.length; i++ && e.currentTarget.firstChild) {
                if (index == i) {
                    chronicleOptions?.children[i].classList.add('selected-chronicle-category'); 
                } else {
                    chronicleOptions?.children[i].classList.remove('selected-chronicle-category'); 
                }
            }
        } else {
            console.log("error selecting css");
        }
    }

    function filterChroniclesByMedium(mediumType: string) {
        switch(mediumType){
            case 'Novels':
                const novelsOnly : Record<string, UserChronicle> = filterUserChronicles("Novel");
                return novelsOnly;
            case 'Graphic Novels':
                const graphicNovelsOnly : Record<string, UserChronicle> = filterUserChronicles("Graphic Novel");
                return graphicNovelsOnly;
            case 'Films':
                const filmsOnly : Record<string, UserChronicle> = filterUserChronicles("Film");
                return filmsOnly;
            case 'Shows':
                const showsOnly : Record<string, UserChronicle> = filterUserChronicles("Show");
                return showsOnly;
            default: 
                return profileUC;
        }
    }

    function filterUserChronicles(entertainment_category : string) {
        let desiredMedium : Record<string, UserChronicle> = {};

        if (profileUC == undefined) {
            return {}
        }

        for (const key in profileUC) {
            if (profileUC[key].entertainment_category == entertainment_category) {
                desiredMedium[key] = profileUC[key];
            }
        }

        return desiredMedium;
    }

    return(
        <div className='chronicle-category-options'>
            <div className='chronicle-category-option selected-chronicle-category' onClick={(e) => mediumChange(e, 0, "")}>
                <p className=''>All</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 1, "Novels")}>
                <p className=''>Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 2, "Graphic Novels")}>
                <p className=''>Graphic Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 3, "Films")}>
                <p className=''>Films</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => mediumChange(e, 4, "Shows")}>
                <p className=''>Shows</p>
            </div>
        </div>
    )
}