import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/Auth/Action';

const Register = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    userEmail: '',
    password: '',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" type="text" className="form-control mb-2" placeholder="Name" onChange={handleChange} />
          <input name="userName" type="text" className="form-control mb-2" placeholder="Username" onChange={handleChange} />
          <input name="userEmail" type="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} />
          <input name="bio" type="text" className="form-control mb-2" placeholder="Bio" onChange={handleChange} />
          <button className="btn btn-success w-100">Register</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;