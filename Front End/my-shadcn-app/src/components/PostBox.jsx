import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/Post/Action';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Smile } from 'lucide-react';

const PostBox = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const textareaRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.posts);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSelectEmoji = (emoji) => {
    const emojiNative = emoji.native;
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + emojiNative);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = content.slice(0, start) + emojiNative + content.slice(end);
    setContent(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emojiNative.length, start + emojiNative.length);
    }, 0);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('content', content); // ✅ Add content here
    if (image) {
      formData.append('image', image);
    }
  
    dispatch(createPost(formData, localStorage.getItem("jwt")))
      .then(() => {
        toast.success("Post created successfully!");
        setContent("");
        setImage(null);
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Failed to create post!";
        toast.error(errorMessage);
      });
  };

  return (
    <Card className="mb-8 w-full max-w-2xl mx-auto shadow-md border">
      <CardHeader>
        <h3 className="text-lg font-semibold">Create a Post</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={() => setShowEmojiPicker((v) => !v)}
            tabIndex={-1}
            aria-label="Add emoji"
          >
            <Smile className="w-6 h-6 text-muted-foreground" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute z-20 top-12 right-0">
              <Picker
                data={data}
                onEmojiSelect={handleSelectEmoji}
                theme="auto"
                previewPosition="none"
                skinTonePosition="none"
                style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: 320 }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1"
          />
          {image && (
            <span className="text-sm text-muted-foreground">
              {image.name}
            </span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full min-w-[100px] flex items-center justify-center"
          disabled={!content.trim() || loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="sr-only">Post</span>
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Post
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostBox;
