package com.Project.social_media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.response.FollowerResponse;
import com.Project.social_media.service.FollowerService;

@RestController
@RequestMapping("/api/follower")
public class FollowerController {
	@Autowired
	FollowerService followerService;
	
	@GetMapping("/getfollowers")
	public ResponseEntity<List<FollowerResponse>> getFollowers(@RequestHeader("Authorization") String jwt) throws Exception{
		List<FollowerResponse> followers = followerService.getFollowers(jwt);
		
		return new ResponseEntity<>(followers, HttpStatus.OK);
	}
	
	@GetMapping("/getfollowing")
	public ResponseEntity<List<FollowerResponse>> getFollowings(@RequestHeader("Authorization") String jwt) throws Exception{
		List<FollowerResponse> following = followerService.getFollowings(jwt);
		
		return new ResponseEntity<>(following, HttpStatus.OK);
	}
	
	@GetMapping("/create/{userName}")
	public ResponseEntity<String> createFollower(@RequestHeader("Authorization") String jwt, @PathVariable String userName) throws Exception{
		String response = followerService.createFollower(jwt, userName);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
