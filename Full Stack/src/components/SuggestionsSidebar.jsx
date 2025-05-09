import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowersAndFollowing } from '../redux/Follower/Action';

const SuggestionsSidebar = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const { following } = useSelector((state) => state.follow);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getFollowersAndFollowing(jwt));
  }, [dispatch]);

  return (
    <div className="bg-white shadow rounded-lg p-4 w-full max-w-sm">
      <h5 className="text-lg font-semibold mb-3 text-indigo-600">Following</h5>
      {following && following.length > 0 ? (
        <ul className="space-y-2">
          {following.map((user) => (
            <li
              key={user.id}
              className="p-2 bg-gray-100 hover:bg-indigo-100 rounded transition text-sm text-gray-700 cursor-pointer"
              onClick={() => onUserSelect(user)} // <--- call the prop
            >
              @{user.userName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">You're not following anyone yet.</p>
      )}
    </div>
  );
};

export default SuggestionsSidebar;
