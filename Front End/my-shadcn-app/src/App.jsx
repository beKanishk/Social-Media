import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Login from './pages/Login';
import Register from './pages/Register';
import ChatPage from './pages/ChatPage';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Home from './pages/Home';
import UserProfile from './components/UserProfile';
import PrivateRoute from './utils/PrivateRoute';
import Search from './pages/Search';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser } from './redux/Auth/Action';
import { getFollowersAndFollowing } from './redux/Follower/Action';
import WebSocketProvider from './utils/WebSocketContext';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [userLoaded, setUserLoaded] = useState(false);
  const userEmail = user?.userEmail;
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser(token)).finally(() => setUserLoaded(true));
      dispatch(getFollowersAndFollowing(token));
    } else {
      setUserLoaded(true); // No token? Still allow UI to load
    }
  }, [dispatch]);

  const privateRoutes = userLoaded ? (
    <>
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/post" element={<PrivateRoute><Post /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
      <Route path="/user/:userName" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
    </>
  ) : (
    <Route path="*" element={
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="terminal-loader text-blue-500 text-5xl"></div>
      </div>
    } />
  );

  const appContent = (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {user ? privateRoutes : <Route path="*" element={<Login />} />}
    </Routes>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {userEmail ? (
        <WebSocketProvider userEmail={userEmail}>
          {appContent}
        </WebSocketProvider>
      ) : (
        appContent
      )}
    </>
  );
};

export default App;
