import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/Auth/Action';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userEmail: '', password: '' });
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ data: formData, navigate }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input name="userEmail" type="text" className="form-control mb-3" placeholder="Email or Username" onChange={handleChange} />
          <input name="password" type="password" className="form-control mb-3" placeholder="Password" onChange={handleChange} />
          <button className="btn btn-primary w-100">Login</button>
        </form>
        {error && <div className="alert alert-danger mt-2">Invalid username or password</div>}
        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;