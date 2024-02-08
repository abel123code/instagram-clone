import React from "react";
import Elon from '../../images/content-images/elon.jpg';
import Abel from '../../images/content-images/abel.jpg';
import ironman from '../../images/content-images/ironman.jpg';
import buggati from '../../images/content-images/buggati.png';
import canelo from '../../images/content-images/canelo.png';
import lky from '../../images/content-images/lky.jpg';
import wtc from '../../images/content-images/wtc.png';
import lightning from '../../images/content-images/lightning.png'
import './Story.css'

function Story() {
  return (
    <div className="stories">
      <div className="story">
        <img src={Elon} />
        <p>ElonMusk</p>
      </div>
      <div className="story">
        <img src={Abel} />
        <p>abellee</p>
      </div>
      <div className="story">
        <img src={buggati} />
        <p>Buggati</p>
      </div>
      <div className="story">
        <img src={canelo} />
        <p>caneloOfficial</p>
      </div>
      <div className="story d2story">
        <img src={ironman} />
        <p>IronMan</p>
      </div>
      <div className="story dstory">
        <img src={wtc} />
        <p>Photography</p>
      </div>
      <div className="story dstory">
        <img src={lky} />
        <p>LkyOffical</p>
      </div>
      <div className="story dstory">
        <img src={lightning} />
        <p>McQueen</p>
      </div>
    </div>
  )
}

export default Story;