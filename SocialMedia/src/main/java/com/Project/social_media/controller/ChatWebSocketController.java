package com.Project.social_media.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

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
    
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageRequest messageRequest, Principal principal) throws Exception {
        String senderEmail = principal.getName(); // Extracted from JWT handshake via Principal
        System.out.println("Sender Email:" + senderEmail);
        // Save and generate response
        MessageResponse response = messageService.handleIncomingMessage(senderEmail, messageRequest);
        System.out.println("Response :" + response);
        // Find receiver's email
        String receiverEmail = userService.findUserById(messageRequest.getReceiverId()).getUserEmail();

        // Send to receiver's queue
        messagingTemplate.convertAndSendToUser(receiverEmail, "/queue/messages", response);
    }


}

