package com.Project.social_media.response;

import com.Project.social_media.model.Post;

public class MessageResponse {
	private String content;
	private String timestamp;
	private String senderName;
	private Long postId;
	private String postImageURL;
	private Post post;
	
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
	public Post getPost() {
		return post;
	}
	public void setPost(Post post) {
		this.post = post;
	}
}
