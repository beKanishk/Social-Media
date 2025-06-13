import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowersAndFollowing } from '../redux/Follower/Action';

const SuggestionsSidebar = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const { followers, following } = useSelector((state) => state.follow);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getFollowersAndFollowing(jwt));
  }, [dispatch]);

  // ✅ Remove duplicates (based on user id or userName)
  const uniqueUsersMap = new Map();

  [...followers, ...following].forEach((user) => {
    uniqueUsersMap.set(user.userId, user); 
  });

  const uniqueUsers = Array.from(uniqueUsersMap.values());

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 w-full max-w-sm">
      <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Chats</h5>
      {uniqueUsers.length > 0 ? (
        <ul className="space-y-2">
          {uniqueUsers.map((user) => (
            <li
              key={user?.userId}
              onClick={() => onUserSelect(user)}
              className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-100 transition"
            >
              @{user.userName}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No users to show.</p>
      )}
    </div>
  );
};

export default SuggestionsSidebar;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getFollowersAndFollowing } from "../redux/Follower/Action";

// const SuggestionsSidebar = ({ onUserSelect }) => {
//   const dispatch = useDispatch();
//   const { following, chatUsers } = useSelector((state) => state.follow);

//   useEffect(() => {
//     const jwt = localStorage.getItem("jwt");
//     dispatch(getFollowersAndFollowing(jwt));
//   }, [dispatch]);

//   const uniqueUsers = [
//     ...new Map([...following, ...chatUsers].map((u) => [u.id, u])).values(),
//   ];

//   return (
//     <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-4 w-full max-w-sm">
//       <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Chats</h5>
//       {uniqueUsers.length > 0 ? (
//         <ul className="space-y-2">
//           {uniqueUsers.map((user) => (
//             <li
//               key={user.id}
//               onClick={() => onUserSelect(user)}
//               className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-600 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-100 transition"
//             >
//               @{user.userName}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-sm text-gray-500 dark:text-gray-400 italic">No chats yet.</p>
//       )}
//     </div>
//   );
// };

// export default SuggestionsSidebar;
