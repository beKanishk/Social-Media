import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowersAndFollowing } from "../redux/Follower/Action";

const SharePostModal = ({ show, onClose, postId, onSend }) => {
  const dispatch = useDispatch();
  const { followers = [], following = [] } = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  // ✅ Fetch followers/following when modal opens
  // useEffect(() => {
  //   if (show && jwt) {
  //     dispatch(getFollowersAndFollowing(jwt));
  //   }
  // }, [show, jwt, dispatch]);

  if (!show) return null;

  const uniqueUsersMap = new Map();
  [...followers, ...following].forEach((user) => {
    uniqueUsersMap.set(user.userId, user);
  });

  const uniqueUsers = Array.from(uniqueUsersMap.values());

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Send Post To</h3>

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {uniqueUsers.length > 0 ? (
            uniqueUsers.map((user) => (
              <li key={user.userId}>
                <button
                  onClick={() => onSend(user.userId)}
                  className="w-full text-left p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-indigo-200 dark:hover:bg-indigo-500 text-sm text-gray-900 dark:text-white"
                >
                  @{user.userName} - {user.name}
                </button>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No users to show.</p>
          )}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-red-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SharePostModal;
