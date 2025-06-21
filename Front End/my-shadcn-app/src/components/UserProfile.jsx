import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createFollower } from '../redux/Follower/Action';
import { fetchUserProfile, clearUserProfile } from '../redux/User/Action';
import { getUser } from '../redux/Auth/Action';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from './Navbar';
import { MessageCircle, ThumbsUp } from "lucide-react";
import { fetchLikes, toggleLike } from "../redux/Likes/Action";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import CommentSection from './CommentSection';

const UserProfile = ({ userName: userNameProp, variant }) => {
  const params = useParams();
  const userName = userNameProp || params.userName;
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.userProfile);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.follow);
  const { postLikes } = useSelector((state) => state.like);
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [dispatch]);

  useEffect(() => {
    if (userName) {
      dispatch(fetchUserProfile(userName));
    }
  }, [userName, dispatch]);

  useEffect(() => {
    if (user && userProfile) {
      const following = user.following?.some(followingItem =>
        userProfile.follower?.includes(followingItem.id)
      );
      // const following = userProfile.follower?.some(fId =>
      //                     user.following?.includes(fId)
      //                   );
      setIsFollowing(following);
    }
  }, [user, userProfile]);

  const handleFollowToggle = async () => {
    const optimisticState = !isFollowing;
    setIsFollowing(optimisticState);
    try {
      dispatch(createFollower(userName, localStorage.getItem("jwt")));
    } catch (error) {
      setIsFollowing(!optimisticState);
      console.error("Follow/Unfollow failed:", error);
    }
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  const toggleComments = (postId, value) => {
    setOpenComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleClearProfilePhoto = async () => {
    await dispatch(clearUserProfile({}, true));
    dispatch(getUser(localStorage.getItem("jwt")));
    if (userProfile?.userName) {
      dispatch(fetchUserProfile(userProfile.userName));
    }
  };

  if (variant === 'inline') {
    return (
      <div className="bg-background flex justify-center py-8 px-4 pt-24">
        <div className="w-full max-w-xl space-y-6">
          {/* User Details Card */}
          <Card className="rounded-xl shadow-2xl p-0 border border-neutral-700 bg-neutral-900">
            <CardHeader className="flex flex-row items-center gap-6 pb-4 break-words">
              <Avatar className="w-12 h-12 md:w-20 md:h-20 border-4 border-primary">
                <img
                  src={userProfile?.profilePictureUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <div
                  className="flex items-center gap-2 mb-1 cursor-pointer group"
                  onClick={() => userProfile?.userName && navigate(`/user/${userProfile.userName}`)}
                >
                  <h2 className="text-xl font-bold text-foreground group-hover:underline">{userProfile?.name}</h2>
                  <span className="text-muted-foreground text-sm group-hover:underline">@{userProfile?.userName}</span>
                </div>
                <div className="flex gap-3 mb-2">
                  <Badge variant="secondary">{userProfile?.follower?.length || 0} Followers</Badge>
                  <Badge variant="secondary">{userProfile?.following?.length || 0} Following</Badge>
                </div>
                <div className="text-muted-foreground text-sm mb-2">{userProfile?.bio}</div>
                {user?.id !== userProfile?.id && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={loading}
                    variant={isFollowing ? "destructive" : "default"}
                    className="mt-1"
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                {user?.id === userProfile?.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={handleClearProfilePhoto}
                  >
                    Clear Profile Photo
                  </Button>
                )}
              </div>
            </CardHeader>
            <Separator />
            {(isFollowing || user?.id === userProfile?.id) ? null : (
              <CardContent>
                <div className="text-muted-foreground italic mt-4">Follow this user to view their posts.</div>
              </CardContent>
            )}
          </Card>
          {/* About Card */}
          {(isFollowing || user?.id === userProfile?.id) && userProfile?.about && (
            <Card className="rounded-xl border bg-card">
              <CardHeader>
                <h3 className="text-base font-semibold text-foreground mb-1">About</h3>
              </CardHeader>
              <Separator />
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{userProfile.about}</p>
              </CardContent>
            </Card>
          )}
          {/* Posts Card */}
          {(isFollowing || user?.id === userProfile?.id) && userProfile?.posts?.length > 0 && (
            <Card className="rounded-xl border bg-card">
              <CardHeader>
                <h3 className="text-base font-semibold text-foreground mb-1">Posts</h3>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                {userProfile?.posts.map(post => {
                  const likes = postLikes[post.id] || [];
                  const likedByYou = likes.some((like) => like.user?.id === user?.id);
                  return (
                    <Card key={post.id} className="bg-muted border rounded-xl">
                      <CardHeader className="flex flex-row items-center gap-3 pb-0">
                        <Avatar className="w-8 h-8">
                          <img
                            src={userProfile?.profilePictureUrl || '/avatar.png'}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{userProfile?.name}</div>
                          <div className="text-xs text-muted-foreground">@{userProfile?.userName}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-foreground mb-2">{post.content}</p>
                        {post.imageUrl && (
                          <img
                            src={`${post.imageUrl}`}
                            alt="Post"
                            className="mt-3 rounded-lg max-h-80 object-cover"
                          />
                        )}
                        <div className="mt-4 border-t border-border pt-3 flex justify-around items-center w-full text-muted-foreground">
                          {/* Like Button */}
                          <Button
                            variant={likedByYou ? "default" : "ghost"}
                            onClick={() => handleLike(post.id)}
                            className="flex flex-col items-center gap-1 text-xs sm:text-sm"
                          >
                            <ThumbsUp className="w-5 h-5" />
                            <span>{likes.length}</span>
                            {likedByYou && <span className="text-[10px] text-primary">(You)</span>}
                          </Button>
                          {/* Comment Button */}
                          <Sheet open={openComments[post.id]} onOpenChange={(open) => toggleComments(post.id, open)}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex items-center gap-0 sm:gap-1 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
                              >
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Comments</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="w-full max-w-md mx-auto h-[80%] sm:rounded-t-xl px-4 py-4">
                              <SheetHeader>
                                <SheetTitle>Comments</SheetTitle>
                              </SheetHeader>
                              <div className="mt-4 overflow-y-auto h-[calc(100%-3rem)]">
                                <CommentSection postId={post.id} />
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }
  // Default: full page
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-10 px-4 pt-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* User Details Card */}
          <Card className="rounded-2xl shadow-lg p-0 border bg-card">
            <CardHeader className="flex flex-row items-center gap-6 pb-4">
              <Avatar className="w-12 h-12 md:w-24 md:h-24 border-4 border-primary">
                <img
                  src={userProfile?.profilePictureUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-12 h-12 md:w-24 md:h-24 rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 cursor-pointer group" onClick={() => userProfile?.userName && navigate(`/user/${userProfile.userName}`)}>
                  <h2 className="text-2xl font-bold text-foreground group-hover:underline">{userProfile?.name}</h2>
                  <span className="text-muted-foreground text-sm group-hover:underline">@{userProfile?.userName}</span>
                </div>
                <div className="flex gap-3 mb-2">
                  <Badge variant="secondary">{userProfile?.follower?.length || 0} Followers</Badge>
                  <Badge variant="secondary">{userProfile?.following?.length || 0} Following</Badge>
                </div>
                <div className="text-muted-foreground text-sm mb-2">{userProfile?.bio}</div>
                {user?.id !== userProfile?.id && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={loading}
                    variant={isFollowing ? "destructive" : "default"}
                    className="mt-1"
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                {user?.id === userProfile?.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={handleClearProfilePhoto}
                  >
                    Clear Profile Photo
                  </Button>
                )}
              </div>
            </CardHeader>
            <Separator />
            {(isFollowing || user?.id === userProfile?.id) ? null : (
              <CardContent>
                <div className="text-muted-foreground italic mt-4">Follow this user to view their posts.</div>
              </CardContent>
            )}
          </Card>
          {/* About Card */}
          {(isFollowing || user?.id === userProfile?.id) && userProfile?.about && (
            <Card className="rounded-2xl border bg-card">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground mb-2">About</h3>
              </CardHeader>
              <Separator />
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{userProfile.about}</p>
              </CardContent>
            </Card>
          )}
          {/* Posts Card */}
          {(isFollowing || user?.id === userProfile?.id) && userProfile?.posts?.length > 0 && (
            <Card className="rounded-2xl border bg-card">
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground mb-4">Posts</h3>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                {userProfile?.posts.map(post => {
                  const likes = postLikes[post.id] || [];
                  const likedByYou = likes.some((like) => like.user?.id === user?.id);
                  return (
                    <Card key={post.id} className="bg-muted border rounded-xl">
                      <CardHeader className="flex flex-row items-center gap-3 pb-0">
                        <Avatar className="w-8 h-8">
                          <img
                            src={userProfile?.profilePictureUrl || '/avatar.png'}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </Avatar>
                        <div>
                          <div className="font-semibold text-sm text-foreground">{userProfile?.name}</div>
                          <div className="text-xs text-muted-foreground">@{userProfile?.userName}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-foreground mb-2">{post.content}</p>
                        {post.imageUrl && (
                          <img
                            src={`${post.imageUrl}`}
                            alt="Post"
                            className="mt-3 rounded-lg max-h-80 object-cover"
                          />
                        )}
                        <div className="mt-4 border-t border-border pt-3 flex justify-around items-center w-full text-muted-foreground">
                          {/* Like Button */}
                          <Button
                            variant={likedByYou ? "default" : "ghost"}
                            onClick={() => handleLike(post.id)}
                            className="flex flex-col items-center gap-1 text-xs sm:text-sm"
                          >
                            <ThumbsUp className="w-5 h-5" />
                            <span>{likes.length}</span>
                            {likedByYou && <span className="text-[10px] text-primary">(You)</span>}
                          </Button>
                          {/* Comment Button */}
                          <Sheet open={openComments[post.id]} onOpenChange={(open) => toggleComments(post.id, open)}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex items-center gap-0 sm:gap-1 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:p-2"
                              >
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">Comments</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="w-full max-w-md mx-auto h-[80%] sm:rounded-t-xl px-4 py-4">
                              <SheetHeader>
                                <SheetTitle>Comments</SheetTitle>
                              </SheetHeader>
                              <div className="mt-4 overflow-y-auto h-[calc(100%-3rem)]">
                                <CommentSection postId={post.id} />
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
