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
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageService messageService;
    
    @Autowired
    UserService userService;
  
    @GetMapping("/chat/messages/{userId}")
    public ResponseEntity<List<MessageResponse>> getMessage(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long userId) throws Exception {

        // 1. Save the message & prepare response
        List<MessageResponse> response = messageService.getMessages(jwt, userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
