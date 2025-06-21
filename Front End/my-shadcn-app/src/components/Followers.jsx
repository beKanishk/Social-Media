import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFollowersAndFollowing, createFollower } from '../redux/Follower/Action';
import { getUser } from '../redux/Auth/Action';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

const Followers = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const follow = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (show) {
      dispatch(getFollowersAndFollowing(jwt));
      // console.log("Follow", follow);
    }
  }, [dispatch, show]);

  const handleToggleFollow = (userName) => {
    dispatch(createFollower(userName, jwt)).then(() => {
      dispatch(getUser(jwt));
      dispatch(getFollowersAndFollowing(jwt));
      
      
    });
  };

  return (
    <Dialog open={show} onOpenChange={v => { if (!v) onHide(); }}>
      <DialogContent className="max-w-md w-full p-0">
        <DialogHeader className="mt-4">
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <Card className="shadow-none border-none bg-transparent">
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {follow.followers.length > 0 ? (
                follow.followers.map((follower, index) => {
                  const isFollowing = follow.following.some(f => f.userName === follower.userName);
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition">
                      <Link to={`/user/${follower.userName}`} className="flex items-center gap-3" onClick={onHide}>
                        <Avatar className="w-8 h-8">
                          <img src={follower.profilePictureUrl || '/avatar.png'} alt={follower.name} className="w-8 h-8 rounded-full object-cover" />
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{follower.name}</div>
                          <div className="text-xs text-muted-foreground">@{follower.userName}</div>
                        </div>
                      </Link>
                      <Button
                        variant={isFollowing ? 'destructive' : 'outline'}
                        size="sm"
                        className="rounded-full px-4"
                        onClick={() => handleToggleFollow(follower.userName)}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground italic text-center py-6">No followers yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
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
