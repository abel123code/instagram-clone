import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instaLogo from '../images/loginLogo.png';
import getTheApp from '../images/getTheApp.png'
import footer from '../images/footer.png';
import footerPhone from '../images/footer-phone.png'
import './Register.css';
import axios from 'axios';


function Register(props) {
  let navigate = useNavigate();

  const goToLogin = () => {
    navigate('/')
  }

  const [formData , setFormData] = useState({
    mobileOrEmail: '',
    fullName: '',
    username: '',
    password: ''
  })

  const handleChange = (event) => {
    const {name,value} = event.target;
    setFormData((prevValue) => {
      return ({
        ...prevValue,
        [name]:value
      })
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/register',formData)
      //if success then navigate to login page 
      navigate('/')
    } catch (error) {
      console.error('Registration failed(try again):' , error)
    }
  }

  return (
    <div className='body'>
      <div className='form-section'>
        <div>
          <form className='form-reg' onSubmit={handleSubmit}>
            <img src={instaLogo} />
            <input name='mobileOrEmail' placeholder='Mobile number or email address' onChange={handleChange} required />
            <input name='fullName' placeholder='Full Name' onChange={handleChange} required />
            <input name='username' placeholder='Username' onChange={handleChange} required />
            <input name='password' placeholder='Password' onChange={handleChange} required />
            <p>People who use our service may have uploaded your contact information to Instagram. Learn more</p>
            <p>People who use our service may have uploaded your contact information to Instagram. Learn more</p>
            <button>Sign Up</button>
          </form>
        </div>
      </div>
      <div className='login-page'>
        <p>Have an account?</p>
        <button onClick={goToLogin}>Log in</button>
      </div>
      <div className='get-the-app'>
        <img src={getTheApp} />
      </div>
      <div className='footer footerR'>
        <img src={footer} />
      </div>
      <div className='footer-phone'>
        <img src={footerPhone} />
      </div>
    </div>
  )
}

export default Register;