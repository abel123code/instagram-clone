import React from "react";
import Elon from '../../images/content-images/elon.jpg';
import './SuggestedAcc.css'
import profileTemplate from '../../images/pfp.jpg'


function SuggestedAcc({username,pfp}) {
  return (
    <div className="acc-suggested">
      <div className="acc-suggested-left">
        <img src={pfp ? pfp : profileTemplate} />
        <p>{username}</p>
      </div>
      <div className="acc-suggested-right">
        <p>Follow</p>
      </div>
    </div>
  )
}

export default SuggestedAcc;