import React, { useEffect } from 'react';
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

import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getUser } from './redux/Auth/Action';
import { getFollowersAndFollowing } from './redux/Follower/Action';
import WebSocketProvider from './utils/WebSocketContext';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userEmail = user?.userEmail;

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser(token)); // ✅ Load user info on app load
      dispatch(getFollowersAndFollowing(token));
    }
  }, [dispatch]); // ✅ DO NOT include `user` here to avoid refetch loops

  const routes = (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/post" element={<PrivateRoute><Post /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/user/:userId" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
    </Routes>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {userEmail ? (
        <WebSocketProvider userEmail={userEmail}>
          {routes}
        </WebSocketProvider>
      ) : (
        routes
      )}
    </>
  );
};

export default App;
