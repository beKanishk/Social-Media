import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowersAndFollowing, createFollower } from '../redux/Follower/Action';
import { getUser } from '../redux/Auth/Action';

const Followers = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const follow = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  // Re-fetch on open or when show changes
  useEffect(() => {
    if (show) {
      dispatch(getFollowersAndFollowing(jwt));
    }
  }, [dispatch, show]);

  const handleToggleFollow = (userName) => {
    dispatch(createFollower(userName, jwt)).then(() => {
      dispatch(getUser(jwt)); // Refresh the user state
      dispatch(getFollowersAndFollowing(jwt)); // Also refresh the modal list
    });
  };
  

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {follow.followers.length > 0 ? (
          follow.followers.map((follower, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>{follower.name}</strong> @{follower.userName}
              </div>
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => handleToggleFollow(follower.userName)}
              >
                {follow.following.some(f => f.userName === follower.userName) ? "Unfollow" : "Follow"}
              </Button>
            </div>
          ))
        ) : (
          <p>No followers yet.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Followers;


// import React, { useEffect } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { getFollowersAndFollowing, createFollower } from '../redux/Follower/Action';

// const Followers = ({ show, onHide, followers }) => {
//   const dispatch = useDispatch();
//   const follow = useSelector((state) => state.follow);
//   const jwt = localStorage.getItem("jwt");

//   useEffect(() => {
//     dispatch(getFollowersAndFollowing(jwt));
//   }, [dispatch]);

//   const handleToggleFollow = (userId) => {
//     dispatch(createFollower(userId, jwt));
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Followers</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {follow.followers.length > 0 ? (
//           follow.followers.map((follower, index) => (
//             <div key={index} className="d-flex justify-content-between align-items-center mb-2">
//               <div>
//                 <strong>{follower.name}</strong> @{follower.userName}
//               </div>
//               <Button
//                 size="sm"
//                 variant="outline-primary"
//                 onClick={() => handleToggleFollow(follower.userName)}
//               >
//                 {follow.following.some(f => f.userName === follower.userName) ? "Unfollow" : "Follow"}
//               </Button>
//             </div>
//           ))
//         ) : (
//           <p>No followers yet.</p>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Followers;
