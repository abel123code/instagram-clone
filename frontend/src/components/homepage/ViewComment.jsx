import React, { useEffect, useState } from 'react'
import './ViewComment.css'
import lky from '../../images/content-images/lky.jpg'
import { FaEllipsisH } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { FaRegPaperPlane } from "react-icons/fa";
import pfp from '../../images/pfp.jpg';
import axios from 'axios';
import { CgLayoutGrid } from 'react-icons/cg';

function ViewComment({trigger , setTrigger, username , imageURL , caption, StatelikeCount,commentArray,profilePic,handleLike,isLiked,handleComment,isTypingComment,comment,submitComment}) {
  const [stateCommentArray , setStateCommentArray] = useState(commentArray);


  useEffect(() => {
    setStateCommentArray(commentArray)
  },[commentArray])



  return (trigger ? (
    <div className='viewComment'>
      <div className='x-button'>
        <button onClick={() => {setTrigger(false)}}>✖</button>
      </div>
      <div className='post-container'>
        <div className='post-inner-container'>
          <div className='post-image'>
            <img src={imageURL} />
          </div>
          <div className='post-content'>
            <div className='top-header'>
              <div className='top-header-left'>
                <img src={profilePic} />
                <p>{username}</p>
                <p>•</p>
                <p className='follow-vc'>Follow</p>
              </div>
              <div className='top-header-right'>
                <FaEllipsisH />
              </div>
            </div>
            <div className='captionAndComments'>
              <div className='viewCaption'>
                <img src={profilePic} />
                <p className='viewCaptionUsername'>{username}</p>
                <p>{caption}</p>
              </div>
              <div className='viewAllComments'>
                {stateCommentArray.map((comment,index) => {
                  return ( 
                    <div className='indiv-comment' key={index}>
                      <img src={comment.pictureURL ? comment.pictureURL : pfp} />
                      <p className='viewCommentsUsername'>{comment.username}</p>
                      <p>{comment.commentText}</p>
                    </div>)
                  })}
              </div>
            </div>
            <div className='VC-like-share-comment-save'>
              <div className='VC-like-share-comment'>
                <button 
                  onClick={handleLike}
                  style={{color: isLiked ? 'red' : 'black'}} ><FaRegHeart /></button>
                <button><FaRegComment /></button>
                <button><FaRegPaperPlane /></button>
              </div>
              <div className='VC-save'>
                <button><FaRegBookmark /></button>
              </div>
            </div>
            <div className='viewLikeCount'>
              <p>Liked by {StatelikeCount} others</p>
            </div>
            <div className='addComment'>
              <CiFaceSmile />
              <form className="left-add-comment" onSubmit={submitComment}>
                <input placeholder="Add a comment" onChange={handleComment} value={comment} />
                {isTypingComment ? (<button className="post-button" style={{color:'rgb(44, 168, 209)'}}>Post</button>) : null}
              </form>        
            </div>
          </div>
        </div>
      </div>
    </div>
  ): null)
}

export default ViewComment