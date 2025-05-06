package com.Project.social_media.controller;



import com.Project.social_media.request.MessageRequest;
import com.Project.social_media.response.MessageResponse;
import com.Project.social_media.service.MessageService;
import com.Project.social_media.service.UserService;

import java.net.http.HttpClient;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    UserService userService;
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestHeader("Authorization") String jwt,
            @RequestBody MessageRequest messageRequest) throws Exception {

        // 1. Save the message & prepare response
        MessageResponse response = messageService.handleIncomingMessage(jwt, messageRequest);
        
     // 2. Get receiver's email
        String receiverEmail = userService.findUserById(messageRequest.getReceiverId()).getUserEmail();

        // 2. Send to the specific user using /user/{user}/queue/messages
        messagingTemplate.convertAndSendToUser(
        		 receiverEmail,
                "/queue/messages",
                response
        );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/messages/{userId}")
    public ResponseEntity<List<MessageResponse>> getMessage(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long userId) throws Exception {

        // 1. Save the message & prepare response
        List<MessageResponse> response = messageService.getMessages(jwt, userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
