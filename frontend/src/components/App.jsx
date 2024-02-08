import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Homepage from './homepage/Homepage';
import CreatePost from './createPost/CreatePost';
import Profile from './profile/Profile'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

