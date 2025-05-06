package com.Project.social_media.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Project.social_media.model.User;
import com.Project.social_media.repository.UserRepository;


@Service
public class CustomerUserDetailsService implements UserDetailsService{
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUserEmail(username);
		
		if(user == null) {
			throw new UsernameNotFoundException(username);
		}
		List<GrantedAuthority> authorityList = new ArrayList<>();
		
		return new org.springframework.security.core.userdetails.User(user.getUserEmail(), user.getPassword(), authorityList);
	}
}
