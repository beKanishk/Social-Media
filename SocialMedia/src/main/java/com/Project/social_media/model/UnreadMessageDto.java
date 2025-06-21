package com.Project.social_media.model;


public class UnreadMessageDto {
    private Long senderId;
    private String senderName;
    private String senderUserName;
    private String senderProfilePictureUrl;
    private int unreadCount;

    public UnreadMessageDto(User user) {
        this.senderId = user.getId();
        this.senderName = user.getName();
        this.senderUserName = user.getUserName();
        this.senderProfilePictureUrl = user.getProfilePictureUrl();
        this.unreadCount = 0;
    }

    public void incrementCount() {
        this.unreadCount++;
    }

	public Long getSenderId() {
		return senderId;
	}

	public void setSenderId(Long senderId) {
		this.senderId = senderId;
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public String getSenderUserName() {
		return senderUserName;
	}

	public void setSenderUserName(String senderUserName) {
		this.senderUserName = senderUserName;
	}

	public String getSenderProfilePictureUrl() {
		return senderProfilePictureUrl;
	}

	public void setSenderProfilePictureUrl(String senderProfilePictureUrl) {
		this.senderProfilePictureUrl = senderProfilePictureUrl;
	}

	public int getUnreadCount() {
		return unreadCount;
	}

	public void setUnreadCount(int unreadCount) {
		this.unreadCount = unreadCount;
	}
    
    
}

