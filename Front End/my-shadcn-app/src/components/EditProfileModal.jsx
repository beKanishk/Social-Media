import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/Auth/Action";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Smile } from 'lucide-react';
import { editUserProfile, clearUserProfile } from "../redux/User/Action";

// For draggable emoji picker
const getCenterPos = () => ({
  x: Math.max(0, window.innerWidth / 2 - 160),
  y: Math.max(0, window.innerHeight / 2 - 200)
});

const EditProfileModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.userProfile);
  const [form, setForm] = useState({
    name: user.name || "",
    userName: user.userName || "",
    userEmail: user.userEmail || "",
    bio: user.bio || "",
    about: user.about || "",
  });

  const [availability, setAvailability] = useState({
    userName: true,
    userEmail: true
  });

  const jwt = localStorage.getItem("jwt");

  // Emoji picker state for bio/about
  const [bioPickerOpen, setBioPickerOpen] = useState(false);
  const [aboutPickerOpen, setAboutPickerOpen] = useState(false);
  const bioRef = useRef(null);
  const aboutRef = useRef(null);

  // Draggable state for bio
  const [bioPickerPos, setBioPickerPos] = useState(getCenterPos());
  const [bioDragging, setBioDragging] = useState(false);
  const [bioDragStart, setBioDragStart] = useState({ x: 0, y: 0 });
  const [bioPickerStart, setBioPickerStart] = useState(getCenterPos());

  // Draggable state for about
  const [aboutPickerPos, setAboutPickerPos] = useState(getCenterPos());
  const [aboutDragging, setAboutDragging] = useState(false);
  const [aboutDragStart, setAboutDragStart] = useState({ x: 0, y: 0 });
  const [aboutPickerStart, setAboutPickerStart] = useState(getCenterPos());

  // Center picker when opened
  useEffect(() => { if (bioPickerOpen) setBioPickerPos(getCenterPos()); }, [bioPickerOpen]);
  useEffect(() => { if (aboutPickerOpen) setAboutPickerPos(getCenterPos()); }, [aboutPickerOpen]);

  // Drag handlers for bio
  const handleBioDragStart = (e) => {
    e.preventDefault();
    setBioDragging(true);
    setBioDragStart({ x: e.clientX, y: e.clientY });
    setBioPickerStart({ ...bioPickerPos });
  };
  const handleBioDrag = (e) => {
    if (!bioDragging) return;
    const dx = e.clientX - bioDragStart.x;
    const dy = e.clientY - bioDragStart.y;
    let newX = bioPickerStart.x + dx;
    let newY = bioPickerStart.y + dy;
    newX = Math.max(0, Math.min(window.innerWidth - 340, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 400, newY));
    setBioPickerPos({ x: newX, y: newY });
  };
  const handleBioDragEnd = () => setBioDragging(false);
  useEffect(() => {
    if (bioDragging) {
      window.addEventListener("mousemove", handleBioDrag);
      window.addEventListener("mouseup", handleBioDragEnd);
    } else {
      window.removeEventListener("mousemove", handleBioDrag);
      window.removeEventListener("mouseup", handleBioDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleBioDrag);
      window.removeEventListener("mouseup", handleBioDragEnd);
    };
  }, [bioDragging]);

  // Drag handlers for about
  const handleAboutDragStart = (e) => {
    e.preventDefault();
    setAboutDragging(true);
    setAboutDragStart({ x: e.clientX, y: e.clientY });
    setAboutPickerStart({ ...aboutPickerPos });
  };
  const handleAboutDrag = (e) => {
    if (!aboutDragging) return;
    const dx = e.clientX - aboutDragStart.x;
    const dy = e.clientY - aboutDragStart.y;
    let newX = aboutPickerStart.x + dx;
    let newY = aboutPickerStart.y + dy;
    newX = Math.max(0, Math.min(window.innerWidth - 340, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 400, newY));
    setAboutPickerPos({ x: newX, y: newY });
  };
  const handleAboutDragEnd = () => setAboutDragging(false);
  useEffect(() => {
    if (aboutDragging) {
      window.addEventListener("mousemove", handleAboutDrag);
      window.addEventListener("mouseup", handleAboutDragEnd);
    } else {
      window.removeEventListener("mousemove", handleAboutDrag);
      window.removeEventListener("mouseup", handleAboutDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleAboutDrag);
      window.removeEventListener("mouseup", handleAboutDragEnd);
    };
  }, [aboutDragging]);

  // Insert emoji at cursor position for bio/about
  const insertEmoji = (field, emoji) => {
    const emojiNative = emoji.native;
    let ref = field === 'bio' ? bioRef.current : aboutRef.current;
    if (!ref) {
      setForm((prev) => ({ ...prev, [field]: prev[field] + emojiNative }));
      return;
    }
    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    const newValue = form[field].slice(0, start) + emojiNative + form[field].slice(end);
    setForm((prev) => ({ ...prev, [field]: newValue }));
    setTimeout(() => {
      ref.focus();
      ref.setSelectionRange(start + emojiNative.length, start + emojiNative.length);
    }, 0);
  };

  useEffect(() => {
    if (form.userName && form.userName !== user.userName && form.userName.trim().length >= 3) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-username/${form.userName}`)
        .then(res => setAvailability(prev => ({ ...prev, userName: res.data.available })))
        .catch(() => setAvailability(prev => ({ ...prev, userName: false })));
    } else {
      setAvailability(prev => ({ ...prev, userName: true }));
    }
  }, [form.userName]);

  useEffect(() => {
    if (form.userEmail && form.userEmail !== user.userEmail && form.userEmail.includes("@")) {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-email/${form.userEmail}`)
        .then(res => setAvailability(prev => ({ ...prev, userEmail: res.data.available })))
        .catch(() => setAvailability(prev => ({ ...prev, userEmail: false })));
    } else {
      setAvailability(prev => ({ ...prev, userEmail: true }));
    }
  }, [form.userEmail]);

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleClearProfilePhoto = async () => {
    try {
      await dispatch(clearUserProfile({}, true));
      toast.success("Profile photo cleared!");
      dispatch(getUser(jwt));
      setImage(null); // Clear local image preview
    } catch (error) {
      toast.error("Failed to clear profile photo.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(editUserProfile(form, image));
      toast.success("Profile updated!");
      dispatch(getUser(jwt));
      onClose();
    } catch (err) {
      toast.error("Update failed.");
      console.error(err);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent className="max-w-md w-full p-0 bg-background border-none shadow-xl rounded-xl">
        <Card className="bg-background border-none shadow-none p-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-2">Edit Profile</DialogTitle>
          </DialogHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-center gap-2">
              <img
                src={image ? URL.createObjectURL(image) : user.profilePictureUrl || "/avatar.png"}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {image && <span className="text-xs text-muted-foreground">{image.name}</span>}
              {user.profilePictureUrl && !image && (
                <Button
                  variant="link"
                  className="text-red-500 text-xs p-0 h-auto"
                  onClick={handleClearProfilePhoto}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      <span>Clearing...</span>
                    </div>
                  ) : (
                    'Clear profile photo'
                  )}
                </Button>
              )}
            </div>
            <Input
              className="w-full"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div>
              <Input
                className="w-full"
                placeholder="Username"
                value={form.userName}
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
              />
              {form.userName && (
                <p className={`text-xs mt-1 ${availability.userName ? 'text-green-600' : 'text-red-600'}`}>
                  {availability.userName ? "Username available" : "Username taken"}
                </p>
              )}
            </div>
            <div>
              <Input
                className="w-full"
                placeholder="Email"
                value={form.userEmail}
                onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
              />
              {form.userEmail && (
                <p className={`text-xs mt-1 ${availability.userEmail ? 'text-green-600' : 'text-red-600'}`}>
                  {availability.userEmail ? "Email available" : "Email already registered"}
                </p>
              )}
            </div>
            <div className="relative">
              <Textarea
                ref={bioRef}
                className="w-full pr-10"
                rows={3}
                placeholder="Bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setBioPickerOpen((v) => !v)}
                aria-label="Add emoji to bio"
              >
                <Smile className="w-5 h-5" />
              </Button>
              {bioPickerOpen && (
                <div
                  className="fixed z-50 w-80 bg-popover rounded-xl shadow-lg"
                  style={{ left: bioPickerPos.x, top: bioPickerPos.y, cursor: bioDragging ? 'grabbing' : 'default' }}
                >
                  <div
                    className="w-full h-8 flex items-center justify-between px-3 cursor-grab bg-muted rounded-t-xl select-none"
                    onMouseDown={handleBioDragStart}
                    style={{ userSelect: 'none' }}
                  >
                    <span className="text-xs text-muted-foreground">Drag me</span>
                    <button
                      onClick={() => setBioPickerOpen(false)}
                      className="rounded-full p-1 hover:bg-muted focus:outline-none"
                      aria-label="Close emoji picker"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="pt-2 pr-2">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) => {
                        insertEmoji('bio', emoji);
                        setBioPickerOpen(false);
                      }}
                      theme="auto"
                      previewPosition="none"
                      skinTonePosition="none"
                      style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: 320 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <Textarea
                ref={aboutRef}
                className="w-full pr-10"
                rows={3}
                placeholder="About"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setAboutPickerOpen((v) => !v)}
                aria-label="Add emoji to about"
              >
                <Smile className="w-5 h-5" />
              </Button>
              {aboutPickerOpen && (
                <div
                  className="fixed z-50 w-80 bg-popover rounded-xl shadow-lg"
                  style={{ left: aboutPickerPos.x, top: aboutPickerPos.y, cursor: aboutDragging ? 'grabbing' : 'default' }}
                >
                  <div
                    className="w-full h-8 flex items-center justify-between px-3 cursor-grab bg-muted rounded-t-xl select-none"
                    onMouseDown={handleAboutDragStart}
                    style={{ userSelect: 'none' }}
                  >
                    <span className="text-xs text-muted-foreground">Drag me</span>
                    <button
                      onClick={() => setAboutPickerOpen(false)}
                      className="rounded-full p-1 hover:bg-muted focus:outline-none"
                      aria-label="Close emoji picker"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="pt-2 pr-2">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) => {
                        insertEmoji('about', emoji);
                        setAboutPickerOpen(false);
                      }}
                      theme="auto"
                      previewPosition="none"
                      skinTonePosition="none"
                      style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: 320 }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!availability.userName || !availability.userEmail || loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
