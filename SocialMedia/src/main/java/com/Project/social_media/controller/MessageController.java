package com.Project.social_media.controller;

import com.Project.social_media.model.Message;
import com.Project.social_media.model.UnreadMessageDto;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.MessageRepository;
import com.Project.social_media.request.MessageRequest;
import com.Project.social_media.response.MessageResponse;
import com.Project.social_media.service.MessageService;
import com.Project.social_media.service.UserService;

import java.net.http.HttpClient;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    
    @Autowired
    MessageRepository messageRepository;
  
    @GetMapping("/chat/messages/{userId}")
    public ResponseEntity<List<MessageResponse>> getMessage(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long userId) throws Exception {

        // 1. Save the message & prepare response
        List<MessageResponse> response = messageService.getMessages(jwt, userId);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/chat/users")
    public ResponseEntity<List<User>> getChatUsers(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Set<User> chatUsers = new HashSet<>();

        List<Message> received = messageRepository.findByReceiver(user);
        List<Message> sent = messageRepository.findBySender(user);

        for (Message m : received) chatUsers.add(m.getSender());
        for (Message m : sent) chatUsers.add(m.getReceiver());

        chatUsers.remove(user); // remove self if present
        return new ResponseEntity<>(new ArrayList<>(chatUsers), HttpStatus.OK);
    }
    
    @GetMapping("/chat/users/{userId}")
    public ResponseEntity<User> addChatUsers(@RequestHeader("Authorization") String jwt, @PathVariable Long userId) throws Exception {
        User user = userService.findUserById(userId);

        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    
    @PutMapping("/chat/mark-read/{senderId}")
    public ResponseEntity<String> markMessagesAsRead(@RequestHeader("Authorization") String jwt, @PathVariable Long senderId) throws Exception {
//    	System.out.println("Mark message called");
        messageService.markMessagesAsRead(jwt, senderId);
        return ResponseEntity.ok("Marked as read");
    }
    
    @GetMapping("/chat/unread")
    public ResponseEntity<List<UnreadMessageDto>> getUnreadMessages(@RequestHeader("Authorization") String jwt) throws Exception {
        User currentUser = userService.findUserProfileByJwt(jwt);

        List<Message> unreadMessages = messageRepository.findAllByReceiverAndIsReadFalse(currentUser);

        Map<Long, UnreadMessageDto> map = new HashMap<>();

        for (Message m : unreadMessages) {
            Long senderId = m.getSender().getId();
            map.putIfAbsent(senderId, new UnreadMessageDto(m.getSender()));
            map.get(senderId).incrementCount();
        }

        return ResponseEntity.ok(new ArrayList<>(map.values()));
    }

}
