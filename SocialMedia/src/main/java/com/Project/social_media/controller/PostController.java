package com.Project.social_media.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Project.social_media.model.Post;
import com.Project.social_media.request.PostRequest;
import com.Project.social_media.response.PostResponse;
import com.Project.social_media.service.PostService;

@RestController
@RequestMapping("/api/post")
public class PostController {
	@Autowired
	private PostService postService;
	
//	@PostMapping("/create")
//	public ResponseEntity<PostResponse> createPost(@RequestHeader("Authorization") String jwt, @RequestBody PostRequest request) throws Exception{
//		PostResponse response = postService.createPost(request, jwt);
//		return new ResponseEntity<>(response, HttpStatus.OK);
//	}
	
	@PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestParam String content,
                                        @RequestParam(required = false) MultipartFile image,
                                        @RequestHeader("Authorization") String jwt) {
        try {
            Post savedPost = postService.createPost(content, image, jwt);
            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create post: " + e.getMessage());
        }
    }
	
	@PostMapping("/delete")
	public ResponseEntity<PostResponse> deletePost(@RequestHeader("Authorization") String jwt, @RequestParam Long postId) throws Exception{
		PostResponse response = postService.deletePost(jwt, postId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
//	@PostMapping("/update")
//	public ResponseEntity<PostResponse> updatePost(@RequestParam Long postId, @RequestBody PostRequest request, @RequestHeader("Authorization") String jwt) throws Exception{
//		PostResponse response = postService.updatePost(request, postId);
//		return new ResponseEntity<>(response, HttpStatus.OK);
//	}
	
	//With image update 
	@PutMapping("/update/{postId}")
	public ResponseEntity<PostResponse> updatePost(
			@RequestParam(required = false) String content,
	        @RequestParam(required = false) MultipartFile image,
	        @PathVariable Long postId
	) throws IOException {
	    PostResponse response = postService.updatePost(content, image, postId);
	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/getall")
	public ResponseEntity<List<Post>> getAllPosts(@RequestHeader("Authorization") String jwt) throws Exception{
		List<Post> response = postService.getAllPosts(jwt);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/get")
	public ResponseEntity<Post> getPost(@RequestParam Long postId, @RequestHeader("Authorization") String jwt) throws Exception{
		Post response = postService.getPost(postId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/archive")
	public ResponseEntity<String> archivePost(@RequestParam Long postId, @RequestHeader("Authorization") String jwt) throws Exception{
		String response = postService.archievePost(postId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@GetMapping("/followerpost")
	public ResponseEntity<List<Post>> getFollowerPosts(@RequestHeader("Authorization") String jwt) throws Exception{
		List<Post> response = postService.getFollowerPosts(jwt);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
}
