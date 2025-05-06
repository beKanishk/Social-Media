package com.Project.social_media.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.social_media.model.Comment;
import com.Project.social_media.request.CommentRequest;
import com.Project.social_media.service.CommentService;

@RestController
@RequestMapping("/api/comment")
public class CommentController {
	@Autowired
	CommentService commentService;
	
	@PostMapping("/create")
	public ResponseEntity<String> createComment(@RequestHeader("Authorization") String jwt, @RequestBody CommentRequest request) throws Exception{
		String response = commentService.createComment(request, jwt);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/get/{postId}")
	public ResponseEntity<List<Comment>> getComment(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception{
		List<Comment> response = commentService.getComment(postId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{commentId}")
	public ResponseEntity<String> deleteComment(@RequestHeader("Authorization") String jwt, @PathVariable Long commentId) throws Exception{
		commentService.deleteComment(commentId);
		return new ResponseEntity<>("Comment deleted", HttpStatus.OK);
	}
}
