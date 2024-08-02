'use client'

import { addUC } from "@/globalRedux/features/User/UserChroniclesSlice";
import { AddChronicleOverlayProps, UserChronicle } from "../interfaces";
import { useAppSelector, useAppDispatch } from "@/globalRedux/hooks";
import Link from "next/link";

export default function AddChronicleOverlay({chronicle, toggle} : AddChronicleOverlayProps) {
    const loggedIn = useAppSelector((state) => state.UserChronicles.loggedIn);
    const dispatch = useAppDispatch();

    function validateInput(e: React.ChangeEvent<any>, chronicleDetail : string) {
      let inputValue = e.target.value;
      let inputNumber : number | null = 0;

      if (!isNaN(parseFloat(inputValue)) ) {
          console.log(inputValue);
          if (inputValue[inputValue.length-1] == ".") {
              return 
          }
          inputNumber = parseFloat(inputValue);
          inputNumber = Math.round(inputNumber * 10)/10
          e.target.value = inputNumber.toString();
      }

      if (chronicleDetail == "rating") {
        console.log(isNaN(parseFloat("")));
          if (isNaN(parseFloat(inputValue))) {
              e.target.value = "";
              return
          } else if (inputNumber < 1) {
              e.target.value = "1";
          } else if (inputNumber > 5) {
              e.target.value = "5";
          }
      }
  }

    async function addChronicle(e: React.FormEvent<HTMLFormElement>) {
      // add chronicle to user  
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      console.log(formData);
      const rating = formData.get("rating");
      const episode = formData.get("episode");
      const status = formData.get("status");
      const start_date = formData.get("start_date");
      const last_read = formData.get("last_read");
      const review = formData.get("review");
      const notes = formData.get("notes");
      
      const addChronicleToUC = await fetch('http://localhost:5172/user/chronicles/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/text' // Example: Accept JSON responses
          },
          credentials: 'include',
          body: JSON.stringify({
              "chronicle_id": chronicle.chronicle_id,
              "status": status,
              "rating": rating,
              "review": review,
              "episode": episode,
              "start_date": start_date,
              "last_read": last_read,
              "notes": notes
          })
      });

      let converted_rating = rating?.toString();
      let converted_episode = episode?.toString();
      let converted_last_read = last_read?.toString();

      let newUC : UserChronicle = {
          book_id: chronicle.chronicle_id,
          book_name: chronicle.chronicle_title,
          entertainment_category: chronicle.entertainment_category,
          episode: converted_episode ? parseFloat(converted_episode) : null,
          last_read: converted_last_read ?? "",
          rating: converted_rating ? parseFloat(converted_rating) : null,
          userChronicleForDelete: null,
          status: status?.toString() ?? "-"
      };

      dispatch(addUC({id: chronicle.chronicle_id, newUC: newUC}));
      toggle(null);
    }

    return(
        <div className='overlay'>
          {loggedIn &&
          <form className="overlay-container add-searched-chronicle" onSubmit={addChronicle}>
              <h1>Add {chronicle.chronicle_title}?</h1>
              <div className="add-searched-chronicle-attributes">
                <div className="searched-attributes row-one">
                  <p>Rating</p>
                    <input className="add-searched-chronicle-attribute-input-num" placeholder={"-"} name="rating" onChange={(e) => validateInput(e, "rating")}/>
                    <p>Episodes</p>
                    <input className="add-searched-chronicle-attribute-input-num" placeholder={"-"} name="episode" onChange={(e) => validateInput(e, "episodes")}/>
                  <p>Status</p>
                  <select defaultValue="-" name="status">
                      <option value="Reading">Reading</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                      <option value="Dropped">Dropped</option>
                      <option value="Plan to Read">Plan to Read</option>
                      <option value="Rereading">Rereading</option>
                      <option value="-">-</option>
                  </select>
                </div>
                <div className="searched-attributes row-two">
                  <p>Start Date</p>
                  <input className="add-searched-chronicle-attribute-input-date" type="date" name="start_date"/>
                  <p>Last Read</p>
                  <input className="add-searched-chronicle-attribute-input-date" type="date" name="last_read"/>
                </div>
                <p>Review</p>
                <textarea placeholder="write your review here" name="review" maxLength={1000}/>
                <p>Notes</p>
                <textarea placeholder="write your notes here" name="notes" maxLength={1000}/>
              </div>
              <div className='overlay-container-button-container'>
                  <button onClick={() => toggle(null)} className='yes'>No</button>
                  <button type="submit" className='no'>Yes</button>
              </div>
          </form>
          }
          {!loggedIn &&
            <div className="overlay-container delete-chronicle">
              <h1 className="overlay-container-title">Login To Add Chronicles</h1>
              <div className="overlay-container-button-container">
                <button onClick={() => toggle(null)} className='yes'>No</button>
                <Link href={"/login"}><button className="no">Login</button></Link>
              </div>
            </div>
          }
      </div>
    )
}