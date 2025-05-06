import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PostList from '../components/PostList';
import { fetchFollowingPosts } from '../redux/Follower/Action';
import FollowerPost from '../components/FollowerPost';


const Home = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container mt-4">
        <SearchBar />
        <h4 className="mb-3">Following Feed</h4>
        <FollowerPost />
      </div>
    </div>
  );
};

export default Home;
