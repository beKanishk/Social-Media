package com.Project.social_media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.model.Likes;
import com.Project.social_media.service.LikesService;

@RestController
@RequestMapping("/api/likes")
public class LikesController {
	@Autowired
	LikesService likesService;
	
	@GetMapping("/get/{postId}")
	public ResponseEntity<List<Likes>> getLikes(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception{
		List<Likes> likes = likesService.getLikes(postId);
		return new ResponseEntity<>(likes, HttpStatus.OK);
	}
	
	@GetMapping("/create/{postId}")
	public ResponseEntity<String> createLike(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception{
		String response = likesService.createLikes(jwt, postId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("delete/{postId}")
	public ResponseEntity<String> deleteLike(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception{
		likesService.deleteLike(jwt, postId);
		return new ResponseEntity<>("Like deleted", HttpStatus.OK);
	}
}
