package com.Project.social_media.serviceInterface;

import java.util.List;

import com.Project.social_media.response.FollowerResponse;

public interface FollowersServiceInterface {
	public List<FollowerResponse> getFollowers(String jwt) throws Exception;
	
	public List<FollowerResponse> getFollowings(String jwt) throws Exception;
	
	public String createFollower(String jwt, String userName) throws Exception;
	
	public String deleteFollower(String jwt, Long followingId);
}
