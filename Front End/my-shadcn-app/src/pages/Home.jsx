import React from 'react';
import Navbar from '../components/Navbar';
import FollowerPost from '../components/FollowerPost';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 sm:pt-4 px-2 sm:px-4 py-4 sm:py-8 pb-16 sm:pb-0">
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-6">
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white px-1 sm:px-0">
            Following Feed
          </h2>
          <FollowerPost />
        </div>
      </div>
    </div>
  );
};


export default Home;
