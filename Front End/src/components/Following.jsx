// import React, { useEffect } from 'react';
// import { Modal } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { getFollowersAndFollowing } from '../redux/Follower/Action';

// const Following = ({ show, onHide, following }) => {
//     const dispatch = useDispatch()
//     const follow = useSelector((state) => state.follow)

//     useEffect(() =>{
//         dispatch(getFollowersAndFollowing(localStorage.getItem("jwt")));
//     }, [dispatch]);

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Following</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {following.length > 0 ? (
//           follow.following.map((user, index) => (
//             <div key={index} className="mb-2">
//               <strong>{user.name}</strong> @{user.userName}
//             </div>
//           ))
//         ) : (
//           <p>Not following anyone yet.</p>
//         )}
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Following;

import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowersAndFollowing, createFollower } from '../redux/Follower/Action';
import { getUser } from '../redux/Auth/Action';

const Following = ({ show, onHide, following }) => {
  const dispatch = useDispatch();
  const follow = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getFollowersAndFollowing(jwt));
  }, [dispatch]);

  const handleToggleFollow = (userName) => {
    dispatch(createFollower(userName, jwt)).then(() => {
      dispatch(getUser(jwt)); // Refresh the user state
      dispatch(getFollowersAndFollowing(jwt)); // Also refresh the modal list
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Following</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {follow.following.length > 0 ? (
          follow.following.map((user, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>{user.name}</strong> @{user.userName}
              </div>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => handleToggleFollow(user.userName)}
              >
                Unfollow
              </Button>
            </div>
          ))
        ) : (
          <p>Not following anyone yet.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Following;
