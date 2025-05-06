package com.Project.social_media.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.social_media.configuration.JwtProvider;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.UserRepository;


@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	public User findUserProfileByJwt(String jwt) throws Exception {
		String email = JwtProvider.getEmailFromToken(jwt);
		User user = userRepository.findByUserEmail(email);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}
	
	public List<User> searchUsersByUsername(String query) {
	    return userRepository.findByUserNameContainingIgnoreCase(query);
	}

	
	public User findByUsername(String userName) throws Exception {
		User user = userRepository.findByUserName(userName);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}
	
	
	public User findUserByEmail(String email) throws Exception {
		User user = userRepository.findByUserEmail(email);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}

	
	public User findUserById(Long id) throws Exception {
		Optional<User> user = userRepository.findById(id);
		if(user.isEmpty()) {
			throw new Exception("User not found exception.");
		}
		return user.get();
	}
}
