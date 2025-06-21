package com.Project.social_media.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.social_media.model.Followers;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.FollowerRepository;
import com.Project.social_media.response.FollowerResponse;
import com.Project.social_media.serviceInterface.FollowersServiceInterface;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class FollowerService implements FollowersServiceInterface{
	@Autowired
	FollowerRepository followerRepository;
	
	@Autowired
	UserService userService;
	
	@Override
	public List<FollowerResponse> getFollowers(String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Followers> followers = followerRepository.findByFollowing(user);
		List<FollowerResponse> responses = new ArrayList<>();
		
		for(Followers follower : followers) {
			FollowerResponse userResponse = new FollowerResponse();
			userResponse.setBio(follower.getFollower().getBio());
			userResponse.setName(follower.getFollower().getName());
			userResponse.setUserName(follower.getFollower().getUserName());
			userResponse.setUserId(follower.getFollower().getId());
			userResponse.setUserEmail(follower.getFollower().getUserEmail());
			userResponse.setProfilePictureUrl(follower.getFollower().getProfilePictureUrl());
			
			responses.add(userResponse);
		}
		return responses;
	}

	@Override
	public List<FollowerResponse> getFollowings(String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Followers> followers = followerRepository.findByFollower(user);
		List<FollowerResponse> responses = new ArrayList<>();
		
		for(Followers follower : followers) {
			FollowerResponse userResponse = new FollowerResponse();
			userResponse.setBio(follower.getFollowing().getBio());
			userResponse.setName(follower.getFollowing().getName());
			userResponse.setUserName(follower.getFollowing().getUserName());
			userResponse.setUserId(follower.getFollowing().getId());
			userResponse.setUserEmail(follower.getFollowing().getUserEmail());
			userResponse.setUserEmail(follower.getFollowing().getProfilePictureUrl());
			
			responses.add(userResponse);
		}
		return responses;
	}

	@Override
	public String createFollower(String jwt, String userName) throws Exception {
		User follower = userService.findUserProfileByJwt(jwt);
		User following = userService.findByUsername(userName);
		
		if (follower.getId().equals(following.getId())) {
	        return ("You cannot follow yourself.");
	    }
		
		if (followerRepository.existsByFollowerAndFollowing(follower, following)) {
			followerRepository.deleteByFollowerAndFollowing(follower, following);
	        return "Unfollowed Successfully";
	    }
		
		Followers follow = new Followers();
		follow.setFollower(follower);
		follow.setFollowing(following);
		
		followerRepository.save(follow);
		return "Followed Successfully";
	}

	@Override
	public String deleteFollower(String jwt, Long followingId) {
		// TODO Auto-generated method stub
		return null;
	}
	
}
