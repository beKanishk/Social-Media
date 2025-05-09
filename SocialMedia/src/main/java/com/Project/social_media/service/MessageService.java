package com.Project.social_media.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.Project.social_media.model.Message;
import com.Project.social_media.model.MessageType;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.MessageRepository;
import com.Project.social_media.repository.PostRepository;
import com.Project.social_media.request.MessageRequest;
import com.Project.social_media.response.MessageResponse;
import com.Project.social_media.serviceInterface.MessageServiceInterface;

@Service
public class MessageService implements MessageServiceInterface{
	@Autowired
	MessageRepository messageRepository;
	
	@Autowired
	UserService userService;
	
	@Autowired
	PostRepository postRepository;
	
	@Override
	public List<MessageResponse> getMessages(String jwt, Long receiverId) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		User receiver = userService.findUserById(receiverId);
		
		List<Message> messages = messageRepository.findConversation(user, receiver);

		List<MessageResponse> messageResponses = new ArrayList<>();
		
		for(Message message : messages) {
			MessageResponse response = new MessageResponse();
			response.setContent(message.getContent());
			response.setTimestamp(message.getCreatedAt());
			response.setSenderName(message.getSender().getName());
			
			messageResponses.add(response);
		}
		return messageResponses;
	}
	
	public MessageResponse handleIncomingMessage(String email, MessageRequest msg) throws Exception {
		User sender = userService.findUserByEmail(email);
	    User receiver = userService.findUserById(msg.getReceiverId());

	    Message message = new Message();
	    message.setSender(sender);
	    message.setReceiver(receiver);
	    message.setContent(msg.getContent());
	    message.setCreatedAt(LocalDateTime.now().toString());
	    message.setType(msg.getType());
	    message.setMessageSide(msg.getMessageSide());
	    
	    if (msg.getType() == MessageType.POST && msg.getPostId() != null) {
	        Optional<Post> post = postRepository.findById(msg.getPostId());
	        message.setContent("Shared a post: " + post.get().getContent());
	    } else {
	        message.setContent(msg.getContent());
	    }
	    
	    messageRepository.save(message);

	    MessageResponse response = new MessageResponse();
	    response.setContent(message.getContent());
	    response.setTimestamp(message.getCreatedAt());
	    response.setSenderName(sender.getName());
	    
	    if (msg.getType() == MessageType.POST && msg.getPostId() != null) {
	    	Optional<Post> post = postRepository.findById(msg.getPostId());
	    	if(post.get() != null) {
	    		response.setPostId(msg.getPostId());
		        response.setPostImageURL(post.get().getImageUrl());
		        response.setPost(post.get());
	    	}
	        
	    }
	    
	    return response;
	}

	
	public String saveMessage(String jwt, MessageRequest request) throws Exception {
	    User sender = userService.findUserProfileByJwt(jwt);
	    User receiver = userService.findUserById(request.getReceiverId());

	    Message message = new Message();
	    message.setContent(request.getContent());
	    message.setCreatedAt(LocalDateTime.now().toString());
	    message.setReceiver(receiver);
	    message.setSender(sender);
	    message.setType(MessageType.TEXT);

	    messageRepository.save(message); 

	    return "Message sent";
	}
	
}

//	public void sendPostAsMessage(String jwt, Post post) {
//	    Message message = new Message();
//	    message.setSender(sender);
//	    message.setReceiver(receiver);
//	    message.setType(MessageType.POST);
//	    message.setContent("Shared a post: " + post.getContent());
//	    message.setCreatedAt(LocalDateTime.now().toString());
//
//	    messageRepository.save(message);
//
//	    // Convert to response
//	    MessageResponse response = new MessageResponse();
//	    response.setContent(message.getContent());
//	    response.setTimestamp(message.getCreatedAt());
//	    response.setSenderName(sender.getName());
//
//	    // Send to existing inbox queue
//	    messagingTemplate.convertAndSendToUser(
//	        receiver.getUserName(),          // User identity (based on JWT)
//	        "/queue/messages",              // Regular inbox
//	        response
//	    );
//	}

	 

