import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFollowersAndFollowing } from "../redux/Follower/Action";
import * as Dialog from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SharePostModal = ({ show, onClose, postId, onSend }) => {
  const dispatch = useDispatch();
  const { followers = [], following = [] } = useSelector((state) => state.follow);
  const jwt = localStorage.getItem("jwt");

  // Fetch followers/following when modal opens (if needed)
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
    <Dialog.Dialog open={show} onOpenChange={v => { if (!v) onClose(); }}>
      <Dialog.DialogPortal>
        {/* Transparent overlay: no background dimming */}
        <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
          <Dialog.DialogContent showCloseButton={false} className="pointer-events-auto bg-transparent shadow-none border-none p-0 max-w-sm w-full flex justify-center items-center">
            <Dialog.DialogTitle className="sr-only">Send Post To</Dialog.DialogTitle>
            <Card className="w-full max-w-sm p-6 rounded-lg shadow-md">
              <CardContent className="p-0">
                <h3 className="text-lg font-bold mb-4 text-foreground">Send Post To</h3>
                <ul className="space-y-2 max-h-64 overflow-y-auto mb-4">
                  {uniqueUsers.length > 0 ? (
                    uniqueUsers.map((user) => (
                      <li key={user.userId}>
                        <Button
                          variant="outline"
                          className="w-full text-left p-2 rounded hover:bg-accent text-sm"
                          onClick={() => onSend(user.userId)}
                        >
                          @{user.userName} - {user.name}
                        </Button>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No users to show.</p>
                  )}
                </ul>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full text-red-500 hover:underline justify-center"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </Dialog.DialogContent>
        </div>
      </Dialog.DialogPortal>
    </Dialog.Dialog>
  );
};

export default SharePostModal;
