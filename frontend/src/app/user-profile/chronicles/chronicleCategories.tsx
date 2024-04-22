'use client';
import Link from 'next/link';
import { MouseEvent } from 'react';
import ChronicleCategoryLayout from './chronicleCategoryLayout';

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

function filterChroniclesByMedium(chronicles: {title: string; rating: number, start_date: Date, last_read: Date, img_src: string, notes: string}[]) {
    
}

export default function UserHistory() {
    return (
        <div className='chronicle-category-options'>
            <div className='chronicle-category-option selected-chronicle-category' onClick={(e) => cssFolderEffect(e, 0)}>
                <p className=''>All</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => cssFolderEffect(e, 1)}>
                <p className=''>Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => cssFolderEffect(e, 2)}>
                <p className=''>Graphic Novels</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => cssFolderEffect(e, 3)}>
                <p className=''>Films</p>
            </div>
            <div className='chronicle-category-option' onClick={(e) => cssFolderEffect(e, 4)}>
                <p className=''>Shows</p>
            </div>
        </div>
    );
  }
  