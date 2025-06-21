package com.Project.social_media.controller;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.configuration.JwtProvider;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.UserRepository;
import com.Project.social_media.response.AuthResponse;
import com.Project.social_media.service.CustomerUserDetailsService;

@RestController
@RequestMapping("/auth")
public class AuthController {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	CustomerUserDetailsService customerUserDetailsService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> registerUser(@RequestBody User user) throws Exception{
		User isEmailExist = userRepository.findByUserEmail(user.getUserEmail());
		
		User isUserNameExist = userRepository.findByUserName(user.getUserName());
		
		if(isEmailExist != null) {
			throw new Exception("Email is already in use with another account.");
		}
		
		if(isUserNameExist != null) {
			throw new Exception("Username is already in use with another account.");
		}
		User newUser = new User();
		
		newUser.setBio(user.getBio());
		newUser.setCreatedAt(LocalDateTime.now().toString());
		newUser.setName(user.getName());
		newUser.setAbout(user.getAbout());
		newUser.setUserEmail(user.getUserEmail());

		// Hash the password before saving
		newUser.setPassword(passwordEncoder.encode(user.getPassword()));

		newUser.setUserName(user.getUserName());
		
		User savedUser = userRepository.save(newUser);
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUserEmail(), user.getPassword());

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = JwtProvider.generateToken(authentication);
		
		AuthResponse response = new AuthResponse();
		response.setJwt(jwt);
		response.setMessage("Register success");
		response.setStatus(true);
		
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
	
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> loginUser(@RequestBody User user) throws Exception {
		String userEmail = user.getUserEmail();
		String userPassword = user.getPassword();
		
		Authentication authentication = authenticate(userEmail, userPassword);
		//User authUser = userRepository.findByUserEmail(userEmail);

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = JwtProvider.generateToken(authentication);
		
		AuthResponse response = new AuthResponse();

		response.setJwt(jwt);
		response.setStatus(true);
		response.setMessage("login success");

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}
	
//	private Authentication authenticate(String userEmail, String userPassword) {
//		UserDetails userDetails = customerUserDetailsService.loadUserByUsername(userEmail);
//
//		if (userDetails == null) {
//			throw new BadCredentialsException("inavlid username");
//		}
//
//		if (!userPassword.equals(userDetails.getPassword())) {
//			throw new BadCredentialsException("invalid password");
//		}
//
////		return new UsernamePasswordAuthenticationToken(userPassword, userDetails, userDetails.getAuthorities());
//		return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());
//
//	}

	private Authentication authenticate(String userEmail, String userPassword) {
		UserDetails userDetails = customerUserDetailsService.loadUserByUsername(userEmail);

		if (userDetails == null) {
			throw new BadCredentialsException("Invalid username");
		}

		// Use passwordEncoder to compare raw and encoded password
		if (!passwordEncoder.matches(userPassword, userDetails.getPassword())) {
			throw new BadCredentialsException("Invalid password");
		}

		return new UsernamePasswordAuthenticationToken(
				userDetails.getUsername(),
				null,
				userDetails.getAuthorities()
		);
	}
}
