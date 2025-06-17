package com.Project.social_media.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String content;
	private String createdAt;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "senderId")
	private User sender;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "receiverId")
	private User receiver;
	
	@Enumerated(EnumType.STRING)
	private MessageType type;
	
	private MessageType messageSide; //means sender or receiver
	
	
	@ManyToOne
	@JoinColumn(name = "postId") // This will create a foreign key in Message table
	@JsonIgnoreProperties({"messages", "likes", "comments", "user"})
	private Post post;

	
	private boolean isRead = false;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	public User getSender() {
		return sender;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public User getReceiver() {
		return receiver;
	}

	public void setReceiver(User receiver) {
		this.receiver = receiver;
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

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public Post getPost() {
		return post;
	}

	public void setPost(Post post) {
		this.post = post;
	}
	
	
	
	
}
