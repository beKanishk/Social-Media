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
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 w-full max-w-sm">
  <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Following</h5>
  {following && following.length > 0 ? (
    <ul className="space-y-2">
      {following.map((user) => (
        <li
          key={user.id}
          onClick={() => onUserSelect(user)}
          className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-100 transition"
        >
          @{user.userName}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-gray-500 dark:text-gray-400 italic">You're not following anyone yet.</p>
  )}
</div>

  );
};

export default SuggestionsSidebar;
