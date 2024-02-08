import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Homepage.css'
import Post from './Post'
import Story from './Story'
import Suggestion from './Suggestion';
import axios from 'axios';


function Homepage() {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [postArray , setPostArray] = useState([])
  const UserInfo = React.createContext();

  useEffect(() => {
    fetchUserData();
    fetchAllPost();
  }, [])

  const fetchAllPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/allPost`);
      setPostArray(response.data)
    } catch (error) {
      console.error(`Error fetching posts: ${error.response ? error.response.data : error.message}`);
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
        setIsLoggedIn(true)
        //console.log(userDetails);
      } catch (error) {
        console.error('Error fetching data: ')
      }
    }
  }

  return ( 
    <UserInfo.Provider value={{id:user.id,username:user.username}}>
      {<div className='homepage'>
        <div className='header-container'>
          <Header />
        </div>
        <div className='storiesAndPost'>
          <Story />
          <div className='post-container'>
            {postArray.map((post,index)=> {
              return (
                <Post 
                  key={index}
                  id={post.id} 
                  currentUserId={user.id}
                  username={post.username} 
                  postId={post.postId} 
                  imageURL={post.imageURL} 
                  caption={post.caption} 
                  likeCount={post.likeCount} 
                  commentCount={post.commentCount} />)
            })}
          </div>
        </div>
        <div className='suggestedAccounts'>
          <Suggestion username={user.username}/>
        </div>
      </div>}
    </UserInfo.Provider>
  )
}

export default Homepage;