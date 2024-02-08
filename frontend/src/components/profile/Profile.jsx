import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import Header from '../homepage/Header'
import axios from 'axios'
import pfp from '../../images/pfp.jpg'
import { Navigate, useNavigate } from "react-router-dom";
import { BsGearWide } from "react-icons/bs";

function Profile() {
  let navigate = useNavigate();
  const [user, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(pfp);
  const [postArray , setPostArray] = useState([])

  useEffect(() => {
    fetchUserData()
  },[])

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

  const fetchPosts = async (id) => {
    try {
      //console.log(id);
      const response = await axios.get('http://localhost:5000/getAllPost', {
        params: { id: id }
      })
      if (response.data.message === 'no post found') {
        //console.log('no post');
        return
      } else {
        console.log(response.data);
        setPostArray(response.data)
      }
    } catch (err) {
      console.log('Error in fetching pfp: ', err.message);
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    submit(file);
  }

  const submit = async (file) => {
    try {
      await submitPfp(file)
    } catch (err) {
      console.error(err)
    }
  }
  

  const submitPfp = async (file) => {
    //console.log(selectedFile);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);

      try {
        const response = await axios.post('http://localhost:5000/submitPfp', formData);
        if (response.status === 200) {
         console.log('Successfully uploaded pfp'); 
         navigate('/home')
        } else {
          console.log('Failed to upload! Try again');
          navigate('/profile')
        }
      } catch (err) {
        console.error('Failed to upload: ', err)
      }
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
        fetchPosts(userDetails.id)
      } catch (error) {
        console.error('Error fetching data: ')
      }
    }
  }

  function triggerFileInput() {
    document.getElementById('profilePicInput').click();
  }


  return (
    <div className='profile-page'>
      <Header />
      <div className='profile-container'>
        <div className='inner-profile-container'>
          <div className='profile-top'>
            <div className='pfp-logo'>
              <form onSubmit={submitPfp}>
                <img src={profilePic} onClick={triggerFileInput} />
                <input 
                  type='file' 
                  name='profilePic' 
                  id='profilePicInput'
                  onChange={handleFileChange}
                  style={{display: 'none'}}
                  accept='image/*' />
              </form>
            </div>
            <div className='profile-details'>
              <div className='pd-top'>
                <p>{user.username}</p>
                <button>Edit Profile</button>
                <button>View archieve</button>
                <BsGearWide />
              </div>
              <div className='pd-mid'>
                <p><strong>3</strong> posts</p>
                <p><strong>2.9M</strong> followers</p>
                <p><strong>1</strong> following</p>
              </div>
              <div className='pd-bottom'>
                <p>this is a caption</p>
              </div>
            </div>
          </div>
          <div className='profile-phone'>
            <div className='phone-top'>
              <div className='ph-profile-pic'>
                <img src={profilePic} />
              </div>
              <div className='ph-acc-details'>
                <p>{user.username}</p>
                <div className='phone-button'>
                  <button>Edit Profile</button>
                  <button>View archieve</button>
                </div>
              </div>
            </div>
            <div className='phone-bottom'>
              <p>this is a caption</p>
            </div>
          </div>
          <div className='post-container-profile'>
            {postArray.map((post,index) => {
              return (<img key={index} src={post.imageURL} />)
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile