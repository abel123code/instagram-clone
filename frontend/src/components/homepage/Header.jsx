import React from "react";
import instaLogo from '../../images/insta_logo.png';
import { IoMdHome } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { BsCameraReels } from "react-icons/bs";
import { LuMessageSquare } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { RxViewGrid } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { FaThreads } from "react-icons/fa6";
import { CgDetailsMore } from "react-icons/cg";
import { FaInstagram } from "react-icons/fa6";
import './Header.css'
import { useNavigate } from 'react-router-dom';


function Header() {
  let navigate = useNavigate()
  
  return (
    <div className="header">
      <div className="top-icons">
        <div className="logo">
          <img src={instaLogo} />
          <button className="instaLogo">
            <FaInstagram className="igIcon" />
          </button>
          <input placeholder="Search" />
        </div>
        <button onClick={() => {navigate('/home')}}><IoMdHome className="icon dIcon" /> <span>Home</span></button>
        <button><IoIosSearch className="icon dIcon" /> <span>Search</span></button>
        <button><MdOutlineExplore className="icon dIcon" /> <span>Explore</span></button>
        <button><LuMessageSquare className="icon dIcon" /> <span>Messages</span></button>
        <button><FaRegHeart className="icon" /> <span>Notification</span></button>
        <button onClick={() => {
          navigate('/createPost')
        }}><RxViewGrid className="icon dIcon" /> <span>Create</span></button>
        <button onClick={() => {navigate('/profile')}}><CgProfile className="icon dIcon" /> <span>Profile</span></button>
      </div>
      <div className="bottom-icons">
        <button><FaThreads className="icon dIcon" /> <span>Threads</span></button>
        <button><CgDetailsMore className="icon dIcon" /> <span>More</span></button>
      </div>
    </div>
  )
}

export default Header;