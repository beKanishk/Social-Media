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
import com.Project.social_media.model.PostDTO;
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
//			if (!message.isRead() && message.getReceiver().getId().equals(user.getId())) {
//		        message.setRead(true); // mark as read
//		        messageRepository.save(message);
//		    }
			MessageResponse response = new MessageResponse();
			response.setContent(message.getContent());
			response.setTimestamp(message.getCreatedAt());
			response.setSenderName(message.getSender().getName());
			response.setRead(message.isRead());
			response.setSenderId(message.getSender().getId());
			response.setReceiverId(message.getReceiver().getId());
			response.setSenderUserName(message.getSender().getUserName()); // ✅ Add this
		    response.setSenderProfileUrl(message.getSender().getProfilePictureUrl());
			
			if(message.getPost() != null) {
				Post post = message.getPost();
				response.setPostId(post.getId());
				response.setPostImageURL(post.getImageUrl());;
				response.setType(MessageType.POST);
			}
			messageResponses.add(response);
		}
		return messageResponses;
	}
	
	public MessageResponse handleIncomingMessage(String email, MessageRequest msg) throws Exception {
		System.out.println("Message Request" + msg);
	    User sender = userService.findUserByEmail(email);
	    User receiver = userService.findUserById(msg.getReceiverId());
	    
	    
	    Message message = new Message();
	    message.setSender(sender);
	    message.setReceiver(receiver);
	    message.setCreatedAt(LocalDateTime.now().toString());
	    message.setType(msg.getType());
	    message.setMessageSide(msg.getMessageSide());
	    message.setRead(false);

	    // Default content
	    String content = msg.getContent();

	    // 👇 Handle POST message properly
	    Post sharedPost = null;
	    if (msg.getType() == MessageType.POST && msg.getPostId() != null) {
	        Optional<Post> postOpt = postRepository.findById(msg.getPostId());
	        if (postOpt.isPresent()) {
	            sharedPost = postOpt.get();
	            content = "Shared a post: " + sharedPost.getContent(); // ✅ Set fallback message
	            message.setPost(sharedPost); // ✅ Save full Post in DB if needed
	            message.setType(MessageType.POST);
	        }
	    }

	    message.setContent(content);
	    messageRepository.save(message);

	    // ✅ Prepare Response
	    MessageResponse response = new MessageResponse();
	    response.setContent(content);
	    response.setTimestamp(message.getCreatedAt());
	    response.setSenderName(sender.getName());
	    response.setSenderId(sender.getId());
	    response.setReceiverId(message.getReceiver().getId());
	    response.setRead(false);
	    response.setSenderUserName(message.getSender().getUserName()); // ✅ Add this
	    response.setSenderProfileUrl(message.getSender().getProfilePictureUrl());
	    
	    if (sharedPost != null) {
	        response.setPostId(sharedPost.getId());
	        response.setPost(new PostDTO(sharedPost));
	        response.setPostImageURL(sharedPost.getImageUrl());
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
	    message.setRead(false);
	   

	    messageRepository.save(message); 

	    return "Message sent";
	}

	public void markMessagesAsRead(String jwt, Long senderId) throws Exception {
		User receiver = userService.findUserProfileByJwt(jwt);
	    User sender = userService.findUserById(senderId);

	    List<Message> messages = messageRepository.findByReceiverAndSender(receiver, sender);
	    for (Message message : messages) {
	        if (!message.isRead()) {
	            message.setRead(true);
	            messageRepository.save(message);
	        }
	    }
	}
}



	 

