// components/SharePostModal.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SharePostModal = ({ show, onClose, postId, onSend }) => {
  const { following } = useSelector((state) => state.follow);

  if (!show) return null;
    // console.log("Following:", following);
    
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Send Post To</h3>
        <ul className="space-y-2">
          {following.map((user) => (
            <li key={user.userId}>
                
              <button
                onClick={() => onSend(user.userId)}
                className="w-full text-left p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-indigo-200 dark:hover:bg-indigo-500 text-sm text-gray-900 dark:text-white"
              >
                @{user.userName} - {user.name}
              </button>
            </li>
          ))}
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
