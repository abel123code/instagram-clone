import React, { useEffect , useState } from "react";
import profilePic from '../../images/content-images/abel.jpg'
import { useNavigate } from 'react-router-dom';
import './Suggestion.css'
import SuggestedAcc from "./SuggestedAcc";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import pfp from '../../images/pfp.jpg'


function Suggestion({username}) {
  let navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(pfp);
  const [user, setUser] = useState({});
  const [suggestedUser , setSuggestedUser] = useState([])

  useEffect(() => {
    fetchUserData();
  },[])

  
  const fetchSuggestedUser = async (id) => {
    try {    
      const response = await axios.get('http://localhost:5000/getSuggestedUser', {
      params: { id: id }
      })
      const array = response.data;
      //console.log(array); 
      setSuggestedUser(array)
    } catch (err) {
      console.error('Error fetching suggested User: ')
    }
  }

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/yourProtectedRoute', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userDetails = response.data.user
        setUser(userDetails)
        //console.log(userDetails);
        fetchProfilePicture(userDetails.id)
        fetchSuggestedUser(userDetails.id)
      } catch (error) {
        console.error('Error fetching data: ')
      }
    }
  }

  const fetchProfilePicture = async (id) => {
    try {
      //console.log(id);
      const response = await axios.get('http://localhost:5000/getProfilePicture', {
        params: { id: id }
      })
      if (response.data.message === 'no profile picture found') {
        //console.log('no pfp');
        return
      } else {
        //console.log(response.data[0].pictureURL);
        const imageURL = response.data[0].pictureURL
        setProfilePic(imageURL)
      }
    } catch (err) {
      console.log('Error in fetching pfp: ', err.message);
    }
  }

  
  return (
    <div className="suggested-MyInfo">
      <div className="my-info">
        <div className="left-myinfo">
          <img src={profilePic} />
          <p><strong>{username}</strong></p>
        </div>
        <div className="right-myinfo">
          <button onClick={() => {
            navigate('/')
          }}><p>Switch</p></button>
        </div>
      </div>
      <div className="suggested-fy">
        <div className="fy-left">
          <p><b>Suggested for you</b></p>
        </div>
        <div className="fy-right">
          <button>See All</button>
        </div>
      </div>
      <div className="suggestedAcc">
        {suggestedUser.map((user,index) => {
          while (index < 5) {
            return <SuggestedAcc key={index} username={user.username} pfp={user.pictureURL}  />
          }
        })}
      </div>
      <div className="footer">
        <div>
          <p>About·Help·Press·API·Job·Privacy·Terms</p>
          <p>Location·Language·Meta Verified</p>
        </div>
        <div className="copyright">
          <p> © 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
    </div>
  )
}

export default Suggestion;