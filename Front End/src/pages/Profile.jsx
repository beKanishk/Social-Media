import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../redux/Auth/Action';
import Followers from '../components/Followers';
import Following from '../components/Following';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    dispatch(getUser(localStorage.getItem("jwt")));
  }, [dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <h3 className="text-xl font-bold">{user?.name || "Loading..."}</h3>
          <small className="text-gray-500">@{user?.userName?.toLowerCase()}</small>
          <p className="mt-2 text-gray-700">{user?.bio || "Bio loading..."}</p>

          <div className="mt-3 d-flex gap-3">
            <button className="btn btn-outline-primary" onClick={() => setShowFollowers(true)}>
              Followers ({user?.follower?.length || 0})
            </button>
            <button className="btn btn-outline-primary" onClick={() => setShowFollowing(true)}>
              Following ({user?.following?.length || 0})
            </button>
            <span className="text-muted ms-2">Posts: {user?.posts?.length || 0}</span>
          </div>
        </div>

        <div className="flex space-x-6 border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${activeTab === "about" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
        </div>

        {activeTab === "about" && (
          <div className="bg-white shadow rounded-lg p-4 relative">
            <p>This is the About section. You can add more user details here.</p>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute top-2 right-3 text-sm px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Edit
            </button>
          </div>
        )}


        {activeTab === "posts" && <PostList />}
      </div>

      <Followers show={showFollowers} onHide={() => setShowFollowers(false)} followers={user?.follower || []} />
      <Following show={showFollowing} onHide={() => setShowFollowing(false)} following={user?.following || []} />
      {showEditModal && <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />}

    </div>
  );
};

export default Profile;
