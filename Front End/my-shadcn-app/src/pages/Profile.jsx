import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/Auth/Action';
import Followers from '../components/Followers';
import Following from '../components/Following';
import EditProfileModal from '../components/EditProfileModal';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { clearUserProfile } from '@/redux/User/Action';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
    // console.log("User", user);
  }, [dispatch]);

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-20 sm:pt-24 pb-16 sm:pb-0">
        <Card className="rounded-2xl shadow-lg p-0 border bg-card mb-6 relative">
        <CardHeader className="flex flex-wrap sm:flex-nowrap items-start gap-6 pb-0">
            {/* Avatar & Clear button */}
            <div className="flex flex-col items-center sm:items-start mt-4">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <img
                  src={user?.profilePictureUrl || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </Avatar>
              
            </div>

            {/* User details */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap mt-4">
                <h3 className="text-2xl font-bold text-foreground">{user?.name || "Loading..."}</h3>
                <span className="text-primary text-sm">@{user?.userName?.toLowerCase()}</span>
              </div>
              {user?.bio && (<p className="mt-1 text-muted-foreground text-sm">{user?.bio}</p>)}
              {/* <p className="mt-1 text-muted-foreground text-sm">{user?.bio || "Bio loading..."}</p> */}
              <div className="flex gap-4 mt-4 flex-wrap">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowFollowers(true)}
                >
                  Followers <span className="font-semibold">({user?.follower?.length || 0})</span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowFollowing(true)}
                >
                  Following <span className="font-semibold">({user?.following?.length || 0})</span>
                </Button>
                <Badge variant="secondary">Posts: {user?.posts?.length || 0}</Badge>
              </div>
            </div>

            {/* Edit Profile button */}
            <div className="w-full sm:w-auto flex justify-center sm:justify-end mt-4 sm:mt-4">
              <Button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium shadow transition w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <Separator className="my-4" />
          <CardContent className="w-full">
            <div className="flex space-x-6 border-b border-border mb-6">
              <Button
                variant="ghost"
                className={`py-2 px-4 font-medium transition border-b-2 rounded-none ${activeTab === "about" ? "border-b-2 border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className={`py-2 px-4 font-medium transition border-b-2 rounded-none ${activeTab === "posts" ? "border-b-2 border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </Button>
            </div>
            {activeTab === "about" && (
              <div className="bg-muted rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold mb-2 text-foreground">About</h4>
                {user?.about ? (
                  <p className="text-muted-foreground">{user?.about}</p>
                ) : (
                  <p className="text-muted-foreground italic">This is the About section. You can add more user details here...</p>
                )}
              </div>
            )}
            {activeTab === "posts" && <PostList />}
          </CardContent>
        </Card>
      </div>
      <Followers show={showFollowers} onHide={() => setShowFollowers(false)} followers={user?.follower || []} />
      <Following show={showFollowing} onHide={() => setShowFollowing(false)} following={user?.following || []} />
      {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />}
    </div>
  );
};

export default Profile;
