import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFollowersAndFollowing } from '../redux/Follower/Action';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { fetchUnreadMessages } from '@/redux/Message/Action';

const SuggestionsSidebar = ({ onUserSelect }) => {
  const dispatch = useDispatch();
  const { followers, following } = useSelector((state) => state.follow);
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);

  const { unreadMessages } = useSelector((state) => state.message);
  // console.log("✅ unreadMessages:", unreadMessages);

  const getUnreadCountForUser = (userId) => {
    if (!Array.isArray(unreadMessages)) return 0;
    return unreadMessages.find((msg) => msg.senderId === userId)?.unreadCount || 0;
  };


  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(getFollowersAndFollowing(jwt));

    dispatch(fetchUnreadMessages());
    
    const interval = setInterval(() => {
      dispatch(fetchUnreadMessages());
    }, 10000); // every 10 seconds
  }, [dispatch]);

  // Extract message senders who are not the current user
  const messageSenders = messages
    .filter((msg) => msg.senderId !== user?.id)
    .map((msg) => ({
      userId: msg.senderId,
      name: msg.senderName,
      userName: msg.senderUserName,
      profilePictureUrl: msg.senderProfilePictureUrl,
    }));

  // Merge followers, following, and message senders
  const combinedUsers = [...followers, ...following, ...messageSenders];

  // Remove duplicates using userId
  const uniqueUsersMap = new Map();
  combinedUsers.forEach((u) => {
    if (u?.userId) {
      uniqueUsersMap.set(u.userId, u);
    }
  });

  const uniqueUsers = Array.from(uniqueUsersMap.values());

  return (
    <Card className="w-full max-w-md h-full flex flex-col bg-card border shadow-md rounded-xl">
      <CardHeader className="pb-2">
        <h5 className="text-lg font-semibold text-foreground">Chats</h5>
      </CardHeader>
      <CardContent>
        {uniqueUsers.length > 0 ? (
          <ul className="space-y-2">
            {uniqueUsers.map((userItem) => {
              const unreadCount = getUnreadCountForUser(userItem.userId);

              return (
                <li key={userItem.userId} className="relative">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-3 justify-start px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 text-sm text-foreground transition shadow-sm"
                    onClick={() => onUserSelect(userItem)}
                    style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
                  >
                    <Avatar className="w-7 h-7 text-xs font-bold">
                      {userItem.profilePictureUrl ? (
                        <img
                          src={userItem.profilePictureUrl}
                          alt="Avatar"
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase">
                          {userItem.name?.charAt(0)}
                        </div>
                      )}
                    </Avatar>
                    <span className="flex flex-col items-start justify-center">
                      <span className="font-semibold text-sm text-foreground leading-tight">
                        {userItem.name}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        @{userItem.userName}
                      </span>
                    </span>
                    {/* {unreadCount > 0 && (
                      <span className="ml-auto flex items-center">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"
                          title={`${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
                        ></span>
                      </span>
                    )} */}

                    {unreadCount > 0 && (
                      <span className="ml-auto flex items-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" title="Unread messages"></span>
                      </span>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No users to show.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsSidebar;
