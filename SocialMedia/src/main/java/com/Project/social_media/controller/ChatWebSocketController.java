package com.Project.social_media.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.model.User;
import com.Project.social_media.request.MessageRequest;
import com.Project.social_media.response.MessageResponse;
import com.Project.social_media.service.MessageService;
import com.Project.social_media.service.UserService;

@RestController
public class ChatWebSocketController {
	@Autowired
	UserService userService;
	
    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

//    @MessageMapping("/chat.send")
//    public void sendMessage(@Payload MessageRequest chatMessage, 
//                            MessageHeaders headers) throws Exception {
//
//        String jwt = (String) headers.get("simpSessionAttributes", Map.class).get("jwt");
//
//
//        MessageResponse savedMessage = messageService.handleIncomingMessage(jwt, chatMessage);
//        Long id = chatMessage.getReceiverId();
//        User user = userService.findUserById(id);
//        
//        // Send to the receiver
//        messagingTemplate.convertAndSendToUser(
//            user.getUserEmail().toString(),
//            "/queue/messages",
//            savedMessage
//        );
//    }
    
    @MessageMapping("/chat.send") // Endpoint: /app/chat.send
    public void sendMessage(@Payload MessageRequest chatMessage, Principal principal) throws Exception {
        // Extract sender email from Principal
        String senderEmail = principal.getName();

        // Let your service handle saving + response generation
        MessageResponse savedMessage = messageService.handleIncomingMessage(senderEmail, chatMessage);

        // Get receiver user
        Long receiverId = chatMessage.getReceiverId();
        User receiver = userService.findUserById(receiverId);

        // Send message to the receiver's personal queue
        messagingTemplate.convertAndSendToUser(
                receiver.getUserEmail(),
                "/queue/messages",
                savedMessage
        );
    }
    

}

