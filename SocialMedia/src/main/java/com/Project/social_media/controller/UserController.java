package com.Project.social_media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.model.User;
import com.Project.social_media.service.UserService;

@RestController
@RequestMapping("api/users")
public class UserController {
	@Autowired
	UserService userService;
	
	@GetMapping("/profile")
	public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<User>> searchUsers(@RequestParam String query, @RequestHeader("Authorization") String jwt) {
	    List<User> users = userService.searchUsersByUsername(query);
	    return ResponseEntity.ok(users);
	}

	@GetMapping("/{userName}")
	public ResponseEntity<User> findByUserName(@PathVariable String userName, @RequestHeader("Authorization") String jwt) throws Exception {
	    User user = userService.findByUsername(userName);
	    return ResponseEntity.ok(user);
	}
}
