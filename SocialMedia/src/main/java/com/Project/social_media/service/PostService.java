package com.Project.social_media.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Project.social_media.model.Followers;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.FollowerRepository;
import com.Project.social_media.repository.PostRepository;
import com.Project.social_media.repository.UserRepository;
import com.Project.social_media.request.PostRequest;
import com.Project.social_media.response.FollowerResponse;
import com.Project.social_media.response.PostResponse;
import com.Project.social_media.serviceInterface.PostServiceInterface;

@Service
public class PostService implements PostServiceInterface{
	@Autowired
	private UserService userService;
	
	@Autowired
	private PostRepository postRepository;
	
	
	private static final String UPLOAD_DIR = "uploads/posts/";
	
	@Override
	public PostResponse createPost(PostRequest postRequest, String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		
		Post newPost = new Post();
		newPost.setContent(postRequest.getContent());
		newPost.setUser(user);
		newPost.setImageUrl(postRequest.getImageUrl());
		
		Post savedPost = postRepository.save(newPost);
		if(savedPost != null) {
			PostResponse response = new PostResponse();
			response.setMessage("Post created successfuly.");
			return response;
		}
		
		PostResponse response = new PostResponse();
		response.setMessage("Error in creating post.");
		
		return response;
	}

	@Override
	public PostResponse deletePost(String jwt, Long postId) throws Exception {
//		User user = userService.findUserProfileByJwt(jwt);
		Optional<Post> post = postRepository.findById(postId);

		if (post.isPresent()) {
		    postRepository.delete(post.get());
		} 
		else {
		    throw new RuntimeException("Post not found with id: " + postId);
		}
		
		PostResponse response = new PostResponse();
		response.setMessage("Post deleted successfuly.");
		
		return response;
	}
	
	public PostResponse updatePost(PostRequest postRequest, Long postId) {

		Optional<Post> post = postRepository.findById(postId);
		
		if (post.isPresent()) {
			Post updatedPost = post.get();
			String imageUrl = postRequest.getImageUrl();
			String content = postRequest.getContent();
			
			if(content != null && !content.trim().isEmpty()) {
				updatedPost.setContent(postRequest.getContent());
			}
			
			if (imageUrl != null && !imageUrl.trim().isEmpty()) {
			    updatedPost.setImageUrl(imageUrl);
			}

			
			postRepository.save(updatedPost);
			
			PostResponse response = new PostResponse();
			response.setMessage("Post updated successfuly.");
			return response;
		} 
		
		
		throw new RuntimeException("Post not found with id: " + postId);
	}
	
	public String archievePost(Long postId) {
		Optional<Post> post = postRepository.findById(postId);
		
		if(post.isPresent()) {
			if(!post.get().isArchievePost()) {
				post.get().setArchievePost(true);
				postRepository.save(post.get());
				
				return "Post archived";
			}
			
			post.get().setArchievePost(false);
			postRepository.save(post.get());
			return "Post Unarchived";
		}
		return ("Post not found with id: " + postId);
	}
	
	@Override
	public List<Post> getAllPosts(String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		
		List<Post> posts = postRepository.findAllByUserId(user.getId());
		
		return posts;
	}

	
//	public List<List<Post>> getFollowerPosts(String jwt) throws Exception{
//		List<FollowerResponse> followers = followerService.getFollowings(jwt);
//		List<List<Post>> posts = new ArrayList<>();
//		
//		for(FollowerResponse follower : followers) {
//			User user = userRepository.findByUserName(follower.getUserName());
//			
//			List<Post> post = postRepository.findAllByUserId(user.getId());
//			if(post != null) {
//				posts.add(post);
//			}
//		}
//		return posts;
//	}
	
	public List<Post> getFollowerPosts(String jwt) throws Exception {
	    User user = userService.findUserProfileByJwt(jwt);
	    List<Followers> following = user.getFollowing();

	    List<Post> allPosts = new ArrayList<>();
	    for (Followers followed : following) {
	        Long followedUserId = followed.getFollowing().getId(); // assuming `getUser()` returns the followed user
	        allPosts.addAll(postRepository.findAllByUserId(followedUserId));
	    }

	    allPosts.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

	    return allPosts;
	}


	
	@Override
	public Post getPost(Long postId) {
		Optional<Post> post = postRepository.findById(postId);
		
		return post.orElseThrow(() -> new RuntimeException("Post not found"));
	}

	@Override
	public Post createPost(String content, MultipartFile image, String jwt) throws Exception {
		String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            imageUrl = "/" + UPLOAD_DIR + fileName;
        }

        User user = userService.findUserProfileByJwt(jwt);
        Post post = new Post();
        post.setContent(content);
        post.setImageUrl(imageUrl);
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now().toString());

        return postRepository.save(post);
	}
	
	public PostResponse updatePost(String content, MultipartFile image, Long postId) throws IOException {
	    Optional<Post> optionalPost = postRepository.findById(postId);

	    if (optionalPost.isEmpty()) {
	        throw new RuntimeException("Post not found with id: " + postId);
	    }

	    Post post = optionalPost.get();

	    // Update content if provided
	    if (content != null && !content.trim().isEmpty()) {
	        post.setContent(content.trim());
	    }

	    // Handle image upload
	    if (image != null && !image.isEmpty()) {
	        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
	        Path filePath = Paths.get("uploads/posts/", fileName); // Adjust path as needed
	        Files.createDirectories(filePath.getParent());
	        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
	        post.setImageUrl("/uploads/posts/" + fileName); // Save relative path or URL
	    }

	    // Save changes
	    postRepository.save(post);

	    PostResponse response = new PostResponse();
	    response.setMessage("Post updated successfully.");
	    return response;
	}


}
