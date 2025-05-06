package com.Project.social_media.serviceInterface;

import java.util.List;

import com.Project.social_media.response.MessageResponse;

public interface MessageServiceInterface {
	public List<MessageResponse> getMessages(String jwt, Long receiverId) throws Exception;
	
	
}
