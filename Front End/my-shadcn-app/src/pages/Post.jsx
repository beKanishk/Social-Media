import React from 'react';
import Navbar from '../components/Navbar';
import PostBox from '../components/PostBox';
import PostList from '../components/PostList';
import SuggestionsSidebar from '../components/SuggestionsSidebar';

const Post = () => {
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3 d-none d-md-block">
            {/* <SuggestionsSidebar /> */}
          </div>
          <div className="col-12 col-md-6">
            <PostBox />
            {/* <PostList /> */}
          </div>
          <div className="col-md-3 d-none d-md-block">
            {/* Optional: You can add content here like ads, recommended posts, or anything else */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
