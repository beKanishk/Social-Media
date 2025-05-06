import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../redux/Post/Action';

const PostBox = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch()

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    // TODO: Dispatch Redux action here
    dispatch(createPost(formData, localStorage.getItem("jwt")))

    console.log('Form data prepared:', formData);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <textarea
          className="form-control mb-2"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="file" accept="image/*" className="form-control mb-2" onChange={handleImageChange} />
        <button className="btn btn-primary w-100" onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
};

export default PostBox;
