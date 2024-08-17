'use client'
import { UserProfileFetch } from "@/app/utils/interfaces";
import convertDatetoReadble from "@/app/utils/convenientFunctions";
import { useAppSelector, useAppDispatch, useAppStore } from '../../../globalRedux/hooks';
import { useEffect, useRef, useState } from "react";
import { ChangeEvent } from "react";
import { updateBio, clearBioUpdate } from "@/globalRedux/features/User/UserOtherSlice";
import apiLink from '@/app/utils/apiLink';

interface UserAboutProps {
    data: UserProfileFetch;
    username: string;
}

export default function UserProfileAbout({data, username}: UserAboutProps) {
    let viewers_username = useAppSelector((state) => state.UserChronicles.username);
    let newBio = useAppSelector((state) => state.UserOther.newBio);
    let bioChanges = useAppSelector((state) => state.UserOther.bioChanges);
    let dispatch = useAppDispatch();
    let [editAllowed, setEditAllowed] = useState(false);
    
    function editBio(e: ChangeEvent<HTMLTextAreaElement>) {
        dispatch(updateBio(e.target.value));
    }

    useEffect(() => {    
      function sendBioChanges() {
          if (bioChanges != "") {
            var url = `${apiLink}/user/${username}/bio`;
            var data = JSON.stringify({
              "bio": bioChanges
            });
            
            dispatch(clearBioUpdate());
            const blob = new Blob([data], { type: 'application/json' });
            navigator.sendBeacon(url, blob);

          }
      }

      document.addEventListener('visibilitychange', sendBioChanges);

      return() => {            
          sendBioChanges();
          document.removeEventListener('visibilitychange', sendBioChanges);
      }
  }, [bioChanges, dispatch, username]);

    useEffect(() => {
        if (viewers_username == username) {
            setEditAllowed(true);
        } else {
            setEditAllowed(false);
        }
    }, [viewers_username, username])

    return ( 
      <div className="about-section">
        <h1 className="about-username">{username}</h1>
        <img src="/about/sakura-3.jpg"/>
        {editAllowed &&
            <textarea defaultValue={newBio == "" ? data.bio : newBio} onChange={editBio}/>
        }
        {!editAllowed &&
            <textarea defaultValue={data.bio} disabled/>
        }
        <div className="about-history">
          <p className="about-history-title">History</p>
          <div className="about-history-subcategories">
                <p>Title</p>
                <p>Action</p>
                <p>Time</p>
                <p>Episode</p>
            </div>
          {data.user_history.map((event, index) => (
            <div className="about-history-item" key={index}>
                <p>{event.title}</p>
                <p>{event.action}</p>
                <p>{convertDatetoReadble(event.occurence)}</p>
                <p>{event.episode}</p>
            </div>
          ))}
        </div>
        <div className="about-stats">
          <p>Statistics</p>
          <ul className="about-section-stats">
            <li className="about-stat">Last Online: {convertDatetoReadble(data.last_online)}</li>
            <li className="about-stat">Date Joined: {convertDatetoReadble(data.date_joined)}</li>
            <li className="about-stat">Watched/Read: {data.watched_or_read}</li>
            <li className="about-stat">Average Rating: {data.avg_rating ?? "Unknown"}</li>
            <li className="about-stats-extra">Genre distribution: Coming Soon</li>
          </ul>
        </div>
      </div>
    );
}
  