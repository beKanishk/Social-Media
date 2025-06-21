import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFollowersAndFollowing, createFollower } from '../redux/Follower/Action';
import { getUser } from '../redux/Auth/Action';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

const Following = ({ show, onHide }) => {
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
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <Card className="shadow-none border-none bg-transparent">
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {follow.following.length > 0 ? (
                follow.following.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition">
                    <Link to={`/user/${user.userName}`} className="flex items-center gap-3" onClick={onHide}>
                      <Avatar className="w-8 h-8">
                        <img src={user.profilePictureUrl || '/avatar.png'} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">@{user.userName}</div>
                      </div>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full px-4"
                      onClick={() => handleToggleFollow(user.userName)}
                    >
                      Unfollow
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic text-center py-6">Not following anyone yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Following;
