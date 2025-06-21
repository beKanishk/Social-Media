package com.Project.social_media.response;



import com.Project.social_media.model.MessageType;
import com.Project.social_media.model.PostDTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class MessageResponse {
	private String content;
	private String timestamp;
	private String senderName;
	private Long postId;
	private String postImageURL;
	private PostDTO post;
	private boolean isRead;
	private Long senderId;
	private Long receiverId;
	private String senderUserName;
	private String senderProfileUrl;
	
	@Enumerated(EnumType.STRING)
	private MessageType type;
	
	public Long getSenderId() {
		return senderId;
	}
	public void setSenderId(Long senderId) {
		this.senderId = senderId;
	}
	public String getSenderUserName() {
		return senderUserName;
	}
	public void setSenderUserName(String senderUserName) {
		this.senderUserName = senderUserName;
	}
	public Long getPostId() {
		return postId;
	}
	public void setPostId(Long postId) {
		this.postId = postId;
	}
	
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	public String getPostImageURL() {
		return postImageURL;
	}
	public void setPostImageURL(String postImageURL) {
		this.postImageURL = postImageURL;
	}
	public PostDTO getPost() {
		return post;
	}
	public void setPost(PostDTO post) {
		this.post = post;
	}
	public boolean isRead() {
		return isRead;
	}
	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}
	public Long getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(Long receiverId) {
		this.receiverId = receiverId;
	}
	public MessageType getType() {
		return type;
	}
	public void setType(MessageType post2) {
		this.type = post2;
	}
	public String getSenderProfileUrl() {
		return senderProfileUrl;
	}
	public void setSenderProfileUrl(String senderProfileUrl) {
		this.senderProfileUrl = senderProfileUrl;
	}
}
