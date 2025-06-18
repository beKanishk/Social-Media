import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/Auth/Action";
import { toast } from "react-toastify";

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user.name || "",
    userName: user.userName || "",
    userEmail: user.userEmail || "",
    bio: user.bio || ""
  });

  const [availability, setAvailability] = useState({
    userName: true,
    userEmail: true
  });

  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (form.userName && form.userName !== user.userName && form.userName.trim().length >= 3) {
      axios.get(`http://localhost:8080/api/users/check-username/${form.userName}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => setAvailability(prev => ({ ...prev, userName: res.data.available })))
        .catch(() => setAvailability(prev => ({ ...prev, userName: false })));
    } else {
      setAvailability(prev => ({ ...prev, userName: true }));
    }
  }, [form.userName]);

  useEffect(() => {
    if (form.userEmail && form.userEmail !== user.userEmail && form.userEmail.includes("@")) {
      axios.get(`http://localhost:8080/api/users/check-email/${form.userEmail}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => setAvailability(prev => ({ ...prev, userEmail: res.data.available })))
        .catch(() => setAvailability(prev => ({ ...prev, userEmail: false })));
    } else {
      setAvailability(prev => ({ ...prev, userEmail: true }));
    }
  }, [form.userEmail]);

  const handleSubmit = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/users/update",
        form,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      toast.success("Profile updated!");
      dispatch(getUser(jwt));
      onClose();
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative z-50 bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit Profile</h2>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div className="mb-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Username"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
          />
          {form.userName && (
            <p className={`text-xs ${availability.userName ? 'text-green-600' : 'text-red-600'}`}>
              {availability.userName ? "Username available" : "Username taken"}
            </p>
          )}
        </div>

        <div className="mb-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={form.userEmail}
            onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
          />
          {form.userEmail && (
            <p className={`text-xs ${availability.userEmail ? 'text-green-600' : 'text-red-600'}`}>
              {availability.userEmail ? "Email available" : "Email already registered"}
            </p>
          )}
        </div>

        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="3"
          placeholder="Bio"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!availability.userName || !availability.userEmail}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
