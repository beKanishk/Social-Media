import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendHorizonal, MoreHorizontal, Smile } from "lucide-react";
import axios from "axios";
import { WebSocketContext } from "../utils/WebSocketContext";
import { setMessages, sendMessage as sendMessageAction, markMessagesAsRead } from "../redux/Message/Action";
import { fetchUserById, getUser } from "../redux/Auth/Action";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as Dialog from '@/components/ui/dialog';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import PostModal from "./PostModal";
import { Avatar } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// Expanded color palette
const chatColors = [
  'bg-primary text-primary-foreground',
  'bg-accent text-accent-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-muted text-muted-foreground',
  'bg-destructive text-destructive-foreground',
  'bg-blue-500 text-white',
  'bg-green-500 text-white',
  'bg-yellow-400 text-black',
  'bg-pink-500 text-white',
  'bg-purple-500 text-white',
  'bg-orange-500 text-white',
  'bg-cyan-500 text-white',
  'bg-lime-500 text-black',
  'bg-rose-500 text-white',
  'bg-gray-800 text-white',
  'bg-gray-200 text-gray-900',
];

const ChatWindow = ({ receiverId, containerHeight = "h-full", onBack }) => {
  
  
  const { stompClient, connected } = useContext(WebSocketContext);
  
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const { user, singleUser } = useSelector((state) => state.auth);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);
  const jwt = localStorage.getItem("jwt");
  const [chatColor, setChatColor] = useState(() => {
    return localStorage.getItem('chatColor') || 'bg-primary text-primary-foreground';
  });
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef(null);
  // Draggable popover state
  const getCenterPos = () => ({
    x: Math.max(0, window.innerWidth / 2 - 200),
    y: Math.max(0, window.innerHeight / 2 - 200)
  });
  const [pickerPos, setPickerPos] = useState(getCenterPos());
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pickerStart, setPickerStart] = useState({ x: 0, y: 0 });
  const [openPostModal, setOpenPostModal] = useState(false);
  const [modalPostId, setModalPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (receiverId) {
      localStorage.setItem("activeChatId", receiverId);
    }
    return () => {
      localStorage.removeItem("activeChatId");
    };
  }, [receiverId]);
  
  useEffect(() => {
    if (receiverId) {
      dispatch(markMessagesAsRead(receiverId));
    }
  }, [receiverId, dispatch]);

  useEffect(() => {
    dispatch(getUser(jwt));
  }, [dispatch]);
  
  useEffect(() => {
    if (receiverId) {
      dispatch(fetchUserById(receiverId, jwt));
      // console.log("Receiver id", receiverId);
      
    }
  }, [receiverId, dispatch]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/messages/${receiverId}`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch(setMessages(res.data));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    if (receiverId) fetchMessages();
  }, [receiverId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist color selection
  useEffect(() => {
    localStorage.setItem('chatColor', chatColor);
  }, [chatColor]);

  useEffect(() => {
    if (emojiPickerOpen) {
      setPickerPos(getCenterPos());
    }
  }, [emojiPickerOpen]);
  // useEffect(() => {
  //   if (stompClient) {
  //     console.log("✅ stompClient is ready to publish.");
  //   }
  // }, [stompClient]);

  
  const handleSend = () => {
    if (!connected || !stompClient || typeof stompClient.publish !== "function") {
      console.warn("⏳ STOMP client not ready or not connected.");
      return;
    }
  
    if (!content.trim()) return;
  
    const message = {
      content,
      receiverId,
      type: "TEXT",
      messageSide: "SEND",
      postId: null,
    };
  
    stompClient.publish({
      destination: "/app/chat.send",
      headers: { Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(message),
    });
  
    dispatch(sendMessageAction({
      ...message,
      senderName: "You",
      senderId: user.id,
      receiverId: receiverId,
      timestamp: new Date().toISOString(),
      read: true,
    }));
  
    setContent("");
  };
  
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Insert emoji at cursor position
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

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPickerStart({ ...pickerPos });
  }, [pickerPos]);

  const handleDrag = useCallback((e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    let newX = pickerStart.x + dx;
    let newY = pickerStart.y + dy;
    // Clamp to viewport
    newX = Math.max(0, Math.min(window.innerWidth - 400, newX));
    newY = Math.max(0, Math.min(window.innerHeight - 400, newY));
    setPickerPos({ x: newX, y: newY });
  }, [dragging, dragStart, pickerStart]);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [dragging, handleDrag, handleDragEnd]);

  return (
    <>
      <Card className={`w-full h-full sm:max-w-2xl sm:mx-auto ${containerHeight} flex flex-col border shadow-lg rounded-2xl`}>
        <CardHeader className="bg-card border-b border-border rounded-t-2xl px-3 py-0 flex items-center gap-2 justify-between min-h-0">
          {/* Back button for mobile */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="block sm:hidden p-2 bg-muted text-foreground rounded"
              aria-label="Back to user list"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          {/* User avatar */}
          <Avatar className="w-10 h-10 mr-2">
            <img
              src={singleUser?.profilePictureUrl || "/avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Avatar>

          <div className="flex-1 flex flex-col items-start justify-center cursor-pointer group" onClick={() => {
            if (singleUser?.userName) {
              navigate(`/user/${singleUser.userName}`);
            }
          }}>
            <span className="font-semibold text-base text-foreground leading-tight group-hover:underline">{singleUser?.name}</span>
            <span className="text-xs text-muted-foreground leading-tight group-hover:underline">@{singleUser?.userName}</span>
          </div>
          <Dialog.Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
            <Dialog.DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto" aria-label="Chat options">
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent showCloseButton={true} className="max-w-xs p-6">
              <Dialog.DialogTitle className="mb-4 text-base font-semibold">Choose chat bubble color</Dialog.DialogTitle>
              <div className="grid grid-cols-5 gap-3">
                {chatColors.map((color, idx) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none ${color} ${chatColor === color ? 'ring-2 ring-ring ring-offset-2 border-ring scale-110' : 'border-border'}`}
                    onClick={() => { setChatColor(color); setColorDialogOpen(false); }}
                    aria-label={`Set chat color ${idx + 1}`}
                  >
                    {chatColor === color && <span className="w-4 h-4 rounded-full bg-background block" />}
                  </button>
                ))}
              </div>
            </Dialog.DialogContent>
          </Dialog.Dialog>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 py-1 space-y-2 sm:space-y-3 bg-background">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground italic mt-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, i) => {
              const isSender = msg?.senderId === user?.id;
              return (
                <div key={i} className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}>
                  {!isSender && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-base">
                      {msg.senderName?.[0] || "?"}
                    </div>
                  )}
                  <div className={`max-w-[60%] px-5 py-3 text-sm rounded-2xl shadow-sm break-words border border-border ${
                    isSender
                      ? chatColor + ' rounded-br-md'
                      : 'bg-muted text-muted-foreground rounded-bl-md'
                  }`}>
                    {msg.type === "POST" ? (
                      <div
                        className="border rounded-md p-2 mt-1 bg-muted cursor-pointer hover:bg-accent/30 transition"
                        onClick={() => {
                          setModalPostId(msg.postId);
                          setOpenPostModal(true);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <p className="text-sm font-medium text-foreground mb-1">Shared a post:</p>
                        <p className="text-sm text-muted-foreground mb-2">{msg.content}</p>
                        {msg.postImageURL && (
                          <img
                            src={`${msg.postImageURL}`}
                            alt="Shared Post"
                            className="w-full max-h-60 object-cover rounded"
                          />
                        )}
                      </div>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                  </div>
                  {isSender && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base ${chatColor}`}>
                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="bg-card border-t border-border rounded-b-2xl px-2 sm:px-4 py-1 flex items-center gap-2">
          <div className="relative flex-1 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mr-2"
              aria-label="Add emoji"
              onClick={() => setEmojiPickerOpen((v) => !v)}
            >
              <Smile className="w-6 h-6" />
            </Button>
            {emojiPickerOpen && (
              <div
                className="p-0 border-none shadow-lg bg-popover z-50 w-96 fixed rounded-xl"
                style={{ left: pickerPos.x, top: pickerPos.y, cursor: dragging ? 'grabbing' : 'default' }}
              >
                <div
                  className="w-full h-8 flex items-center justify-between px-3 cursor-grab bg-muted rounded-t-xl select-none"
                  onMouseDown={handleDragStart}
                  style={{ userSelect: 'none' }}
                >
                  <span className="text-xs text-muted-foreground">Drag me</span>
                  <button
                    onClick={() => setEmojiPickerOpen(false)}
                    className="rounded-full p-1 hover:bg-muted focus:outline-none"
                    aria-label="Close emoji picker"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="pt-2 pr-2">
                  <Picker
                    data={data}
                    onEmojiSelect={handleSelectEmoji}
                    theme="auto"
                    previewPosition="none"
                    skinTonePosition="none"
                    style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: 380 }}
                  />
                </div>
              </div>
            )}
            <Textarea
              ref={textareaRef}
              className="flex-1 resize-none min-h-[32px] sm:min-h-[44px] max-h-24 sm:max-h-32 rounded-xl border px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ paddingRight: 40 }}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!content.trim()}
            className={`ml-2 px-6 py-2 rounded-xl font-semibold shadow ${chatColor}`}
          >
            <SendHorizonal className="w-5 h-5 mr-1" />
            Send
          </Button>
        </CardFooter>
      </Card>
      {/* Post Modal for shared posts */}
      {openPostModal && (
        <PostModal postId={modalPostId} open={openPostModal} onClose={() => setOpenPostModal(false)} />
      )}
    </>
  );
};

export default ChatWindow;

