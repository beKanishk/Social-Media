package com.Project.social_media.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Project.social_media.model.User;
import com.Project.social_media.model.UserDetailsDTO;
import com.Project.social_media.repository.UserRepository;
import com.Project.social_media.service.UserService;

@RestController
public class UserController {
	@Autowired
	UserService userService;
	
	@Autowired
	UserRepository userRepository;
	
	@GetMapping("api/users/profile")
	public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@GetMapping("api/users/search")
	public ResponseEntity<List<User>> searchUsers(@RequestParam String query, @RequestHeader("Authorization") String jwt) {
	    List<User> users = userService.searchUsersByUsername(query);
	    return ResponseEntity.ok(users);
	}
	
	@GetMapping("api/users/get")
	public ResponseEntity<User> getUserById(@RequestParam Long userId, @RequestHeader("Authorization") String jwt) throws Exception {
	    User users = userService.findUserById(userId);
	    return ResponseEntity.ok(users);
	}
	
	@GetMapping("api/auth/check-username/{username}")
	public ResponseEntity<Map<String, Boolean>> checkUsername(@PathVariable String username) {
	    boolean exists = userRepository.existsByUserName(username);
	    return ResponseEntity.ok(Map.of("available", !exists));
	}

	@GetMapping("api/auth/check-email/{email}")
	public ResponseEntity<Map<String, Boolean>> checkEmail(@PathVariable String email) {
	    boolean exists = userRepository.existsByUserEmail(email);
	    return ResponseEntity.ok(Map.of("available", !exists));
	}

	
	@GetMapping("api/users/{userName}")
	public ResponseEntity<User> findByUserName(@PathVariable String userName, @RequestHeader("Authorization") String jwt) throws Exception {
	    User user = userService.findByUsername(userName);
	    return ResponseEntity.ok(user);
	}
	
	@PutMapping("api/users/update")
	public ResponseEntity<User> editUserDetails(@RequestHeader("Authorization") String jwt, @ModelAttribute UserDetailsDTO userDetailsDTO, @RequestParam(required = false) MultipartFile image) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		userService.editUserDetails(user, userDetailsDTO, image);
	    return ResponseEntity.ok(user);
	}
	
	@PutMapping("api/users/clear")
	public ResponseEntity<User> clearUserDetails(
	    @RequestHeader("Authorization") String jwt,
	    @RequestBody(required = false) UserDetailsDTO userDetailsDTO,
	    @RequestParam(required = false, defaultValue = "false") boolean clearImage
	) throws Exception {
	    User user = userService.findUserProfileByJwt(jwt);
	    userService.clearUserDetails(user, userDetailsDTO, clearImage);
	    return ResponseEntity.ok(user);
	}
}
