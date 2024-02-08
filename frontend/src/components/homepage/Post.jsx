import React, { useEffect, useState } from "react";
import './Post.css'
import lky from '../../images/content-images/lky.jpg'
import { FaEllipsisH } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { FaRegPaperPlane } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import pfp from '../../images/pfp.jpg'
import axios from "axios";
import ViewComment from "./ViewComment";

function Post({id , username , postId , imageURL , caption , likeCount , commentCount, currentUserId}) {

  const [isLiked , setIsLiked] = useState(false)
  const [StatelikeCount , setLikedCount] = useState(likeCount)
  const [StateCommentCount , setCommentCount] = useState(commentCount)
  const [isTypingComment , setIsTypingComment] = useState(false)
  const [comment , setComment] = useState('')
  const [showComment , setShowComment] = useState(false)
  const [commentArray , setCommentArray] = useState(null)
  const [profilePic, setProfilePic] = useState(pfp); 


  useEffect(() => {
    const fetchCheckLike = async () => {
      try {
        await checkLike();
      } catch (err) {
        console.error('Error fetching check like: ', err)
      }
    }

    fetchCheckLike()
  },[currentUserId,postId])

  useEffect(() => {
    setLikedCount(likeCount);
    setCommentCount(commentCount);
    fetchComment();
    fetchProfilePicture(id);
  }, [likeCount,commentCount]); 
  //when likeCount changes , it will call useEffect hook as it a dependency


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

  const fetchComment = async () => {
    const response = await axios.post('http://localhost:5000/fetchComment', {
      postId: postId,
      currentUserId: currentUserId
    })
    const data = response.data;
    //console.log(data);
    setCommentArray(data)
  }

  const checkLike = async () => {
    const response = await axios.post('http://localhost:5000/checkLike', {
      postId: postId,
      currentUserId: currentUserId
    })
    //console.log(response.data);
    const data = response.data;
    setIsLiked(data.liked)
  }



  const handleLike = async () => {
    const response = await axios.post('http://localhost:5000/likeUnlike', {
      postId: postId,
      currentUserId: currentUserId
    });
    const data = response.data;
    setIsLiked(data.liked);
    setLikedCount(prevCount => data.liked ? prevCount + 1 : prevCount - 1);
  }

  function handleComment(event) {
    setIsTypingComment(true);
    const typedComment = event.target.value;
    setComment(typedComment);

    if (typedComment === '') {
      setIsTypingComment(false)
    }
  }

  const submitComment = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.post('http://localhost:5000/submitComment', {
        postId: postId,
        currentUserId: currentUserId,
        comment: comment
      })
      if (response.status === 200) {
        //successfully inserted into db 
        //console.log('insert success');
        setIsTypingComment(false);
        setComment('');
        setCommentCount((prevCount) => {return (prevCount + 1)});
        fetchComment();
      } else {
        console.log('Upload comment failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleShowComment() {
    setShowComment(!showComment);
  }

  return (
    <div className="post">
      <div className="details">
        <div className="details-left">
          <img src={profilePic} alt="Profile Picture" />
          <p><b>{username}</b></p>
          <p className="post-timing">• 1 d</p>
        </div>
        <div className="details-right">
          <FaEllipsisH />
        </div>
      </div>
      <div className="content">
        <img src={imageURL} alt="Post Image" />
      </div>
      <div className="like-share-save">
        <div className="like-share">
          <button 
            onClick={handleLike}
            style={{color: isLiked ? 'red' : 'black'}}><FaRegHeart /></button>
          <button><FaRegComment /></button>
          <button><FaRegPaperPlane /></button>
        </div>
        <div className="save">
          <button><FaRegBookmark /></button>
        </div>
      </div>
      <div className="post-footer-content">
        <div className="like-count">
          <p><b>{StatelikeCount} likes</b></p>
        </div>
        <div className="caption">
          <p><b>{username}</b></p>
          <p>{caption}</p>
        </div>
        <button onClick={handleShowComment}>View all {StateCommentCount} comments</button>
        <ViewComment 
          trigger={showComment} 
          setTrigger={setShowComment}
          username={username} 
          imageURL={imageURL} 
          caption={caption} 
          StatelikeCount={StatelikeCount}
          commentArray={commentArray}
          profilePic={profilePic}
          handleLike={handleLike}
          isLiked={isLiked}
          submitComment={submitComment}
          handleComment={handleComment}
          isTypingComment={isTypingComment}
          comment={comment} />
      </div>
      <div className="add-comment">
        <form className="left-add-comment" onSubmit={submitComment}>
          <input placeholder="Add a comment" onChange={handleComment} value={comment} />
          {isTypingComment ? (<button className="post-button">Post</button>) : null}
        </form>
        <div className="right-add-comment">
          <CiFaceSmile />
        </div>
      </div>
    </div>
  )
}

export default Post;