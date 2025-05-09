package com.Project.social_media.request;

import com.Project.social_media.model.MessageType;

public class MessageRequest {
	private String content;
	private Long receiverId;
	private MessageType type;
	private MessageType messageSide; //means sender or receiver
	private Long postId;
	
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
	public Long getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(Long receiverId) {
		this.receiverId = receiverId;
	}
	public MessageType getType() {
		return type;
	}
	public void setType(MessageType type) {
		this.type = type;
	}
	public MessageType getMessageSide() {
		return messageSide;
	}
	public void setMessageSide(MessageType messageSide) {
		this.messageSide = messageSide;
	}
	
	
	
	
}
