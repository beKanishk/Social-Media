import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createFollower } from '../redux/Follower/Action';
import { fetchUserProfile } from '../redux/User/Action';
import { getUser } from '../redux/Auth/Action';

const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userProfile);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.follow);

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (user && userProfile) {
      const following = userProfile.follower?.some(f => f.follower?.id === user.id);
      setIsFollowing(following);
    }
  }, [user, userProfile]);

  const handleFollowToggle = async () => {
    const optimisticState = !isFollowing;
    setIsFollowing(optimisticState);
    try {
      await dispatch(createFollower(userId, localStorage.getItem("jwt")));
    } catch (error) {
      setIsFollowing(!optimisticState);
      console.error("Follow/Unfollow failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-5">
          <img
            src={userProfile?.profilePictureUrl || 'https://via.placeholder.com/150'}
            className="h-20 w-20 rounded-full border-4 border-blue-300 shadow-md"
            alt="Profile"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{userProfile?.name}</h2>
            <p className="text-blue-500 text-sm">@{userProfile?.userName}</p>
            <p className="text-sm text-gray-600 mt-1">{userProfile?.bio}</p>
            <div className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">{userProfile?.follower?.length || 0}</span> Followers ·{" "}
              <span className="font-semibold">{userProfile?.following?.length || 0}</span> Following
            </div>
          </div>
          {user?.id !== userProfile?.id && (
            <button
              onClick={handleFollowToggle}
              disabled={loading}
              className={`px-5 py-2 rounded-full font-medium transition duration-300 ${
                isFollowing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        <hr className="my-6 border-gray-300" />

        {(isFollowing || user?.id === userProfile?.id) ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Posts</h3>
            <div className="space-y-4">
              {userProfile?.posts.map(post => (
                <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-gray-800">{post.content}</p>
                  {post.imageUrl && (
                    <img
                      src={`http://localhost:8080${post.imageUrl}`}
                      alt="Post"
                      className="mt-3 rounded-lg max-h-80 object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-6">Follow this user to view their posts.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
