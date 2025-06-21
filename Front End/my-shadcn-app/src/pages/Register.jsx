import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/Auth/Action';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    userEmail: '',
    password: '',
    bio: '',
    about: '',
  });

  const [availability, setAvailability] = useState({
    userName: null,
    userEmail: null
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password") {
      if (value.length > 0 && value.length <= 6) {
        setPasswordError("Password must be more than 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.userName.length >= 3) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-username/${formData.userName}`);
          setAvailability(prev => ({ ...prev, userName: res.data.available }));
        } catch {
          setAvailability(prev => ({ ...prev, userName: false }));
        }
      }
    };
    checkUsername();
  }, [formData.userName]);
  
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.userEmail.includes('@')) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-email/${formData.userEmail}`);
          setAvailability(prev => ({ ...prev, userEmail: res.data.available }));
        } catch {
          setAvailability(prev => ({ ...prev, userEmail: false }));
        }
      }
    };
    checkEmail();
  }, [formData.userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(register(formData));
      toast.success('✅ Registration successful! Redirecting to login...');
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      toast.error("❌ Registration failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription className="text-center">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            <div className="space-y-1">
              <Input
                name="userName"
                type="text"
                placeholder="Username"
                onChange={handleChange}
                required
              />
              {formData.userName && (
                <div className={`flex items-center space-x-2 text-sm ${
                  availability.userName ? "text-green-600" : "text-red-600"
                }`}>
                  {availability.userName ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>
                    {availability.userName ? "Username available" : "Username taken"}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Input
                name="userEmail"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              {formData.userEmail && (
                <div className={`flex items-center space-x-2 text-sm ${
                  availability.userEmail ? "text-green-600" : "text-red-600"
                }`}>
                  {availability.userEmail ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>
                    {availability.userEmail ? "Email available" : "Email already in use"}
                  </span>
                </div>
              )}
            </div>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {passwordError && (
              <div className="text-red-600 text-sm mt-1">{passwordError}</div>
            )}
            <Input
              name="bio"
              type="text"
              placeholder="Bio"
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!availability.userName || !availability.userEmail || !!passwordError || formData.password.length === 0}
            >
              Register
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
