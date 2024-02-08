import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../images/loginImage.png'
import logo from '../images/insta_logo.png'
import getTheApp from '../images/getTheApp.png'
import loginFB from '../images/loginFB.png'
import footer from '../images/footer.png'
import footerPhone from '../images/footer-phoneLogin.png'
import './Login.css'
import axios from 'axios'


function Login() {
  let navigate = useNavigate();

  const [credentials , setCredentials] = useState({
    username: '',
    password: ''
  })

  function setKeyedInput(event) {
    const { name , value } = event.target;
    setCredentials((prevValue) => {
      return ({
        ...prevValue,
        [name]: value
      })
    })
  }

  const handleSubmit = async (event) => {
    //console.log('submit triggerd');
    event.preventDefault()
    try {
      //console.log(credentials);
      const response = await axios.post('http://localhost:5000/',credentials)
      //if successful , show homepage 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Login successful, navigate to home
        navigate('/home');
      } else {
        setCredentials({
          username: '',
          password: ''
        })
        navigate('/')
      }
    } catch (error) {
      setCredentials({
        username: '',
        password: ''
      })
      console.error('Login failed(try again):' , error)
    }
  }
  
  return (
    <>
      <div className='top-section'>
        <div className='container-wrap'>
          <div className='side-image'>
            <img src={loginImage} alt='phone-image'/>
          </div>
          <div className='right-side'>
            <div className='login-form'>
              <form onSubmit={handleSubmit}>
                <img className='ig_logo' src={logo} alt='phone-image'/>
                <input name='username' placeholder='username' onChange={setKeyedInput} value={credentials.username} />
                <input name='password' placeholder='password' type='password' value={credentials.password} onChange={setKeyedInput} /> 
                <button>Log in</button>
                <img className='login_fb' src={loginFB} />
              </form>
            </div>
            <div className='sign-up-container'>
              <div>
                <p>Don't have an account?</p>
                <button onClick={() => {
                  navigate('/register')
                }}>Sign up</button>
              </div>
            </div>
            <div>
              <img src={getTheApp} />
            </div>
          </div>
        </div>
      </div>
      <div className='bottom-section'>
        <div className='footer'>
          <img src={footer} className='footer-laptop' />
          <img src={footerPhone} className='footer-phone' />
        </div>
      </div>
    </>
  )
}

export default Login;