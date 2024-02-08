import React, { useState, useEffect } from "react";
import Dropzone from 'react-dropzone';
import { TfiGallery } from "react-icons/tfi";
import './CreatePost.css'
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePost() {
  const [preview , setPreview] = useState(null)
  const [file , setFile ] = useState(null);
  const [caption , setCaption] = useState("");
  const [isDrop , setIsDrop] = useState(false);

  let navigate = useNavigate();

  //token code start 
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
          console.error('Error fetching data: ' , error)
        }
      }
    }

    fetchUserData();
  }, [])
  //token code end 

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(acceptedFiles[0]));
      setIsDrop(true)
    }
  };

  const handleSubmit = async (event) =>  {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file) //append image
      formData.append('caption', caption) //append caption
      if (user.id && user.username) {
        formData.append('userId', user.id)
      }

      try {
        //for (let [key, value] of formData.entries()) {
          //console.log(key, value); //(helped to test formdata)
        //}
        const response = await axios.post('http://localhost:5000/createPost', formData)
        
        if (response.status === 200) {
          //console.log('Success: ' ,response.data);
          navigate('/home')
        } else {
          console.error('Upload failed: ', response)
        }
      } catch (err) {
        console.error('Error: ' , err)
      }
    }
  }

  return (
    <form className="createPostForm" onSubmit={handleSubmit}>
      <h2>Create a new post</h2>
      <Dropzone onDrop={onDrop}>
        {({getRootProps,getInputProps}) => 
          (<div {...getRootProps()} className="drop-zone">
            <input {...getInputProps()} />
            <TfiGallery className="gallery-icon" />
            <p>Drag photos and videos here</p>
            <p>Click to select from computer</p>
          </div>)
        }
      </Dropzone>
      {file && <img src={preview} alt="Preview" className="image-preview" />}
      {isDrop ? (
        <div className="form-caption">
          <input 
            type="text" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            placeholder="Enter a caption..."
          />
          <button type="submit">Share</button>
        </div>) : null}
    </form>
  )
}

export default CreatePost;