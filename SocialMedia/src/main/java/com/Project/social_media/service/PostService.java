package com.Project.social_media.service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.Project.social_media.model.Followers;
import com.Project.social_media.model.ImageUpload;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.FollowerRepository;
import com.Project.social_media.repository.ImageUploadRepository;
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
	
	@Autowired
	private ImageUploadRepository imageUploadRepository;
	
	@Value("${imgbb.api.key}")
    private String imgbbApiKey;
	
	@Value("${image.url}")
	private String imgbbUrl;


	@Override
	public PostResponse deletePost(String jwt, Long postId) throws Exception {
//		User user = userService.findUserProfileByJwt(jwt);
		Optional<Post> post = postRepository.findById(postId);

		if (post.isPresent()) {
			ImageUpload postImage =  imageUploadRepository.findByPost(post.get());
			if(postImage != null){
				imageUploadRepository.delete(postImage);
			}
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


	public Post createPost(String content, MultipartFile image, String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);

		Post post = new Post();
		post.setUser(user);
		post.setContent(content);
		post.setCreatedAt(LocalDateTime.now().toString());

		// Save post first to generate an ID
		post = postRepository.save(post);

		if (image != null && !image.isEmpty()) {
			ImageUpload imageUpload = uploadToImgBB(image);
			imageUpload.setPost(post);

			ImageUpload savedImageUpload = imageUploadRepository.save(imageUpload);

			post.setImageUrl(savedImageUpload.getImageUrl());
			post.setImageUpload(savedImageUpload);

			//  Save again with image URL set
			post = postRepository.save(post);
		}

		return post;
	}




	private ImageUpload uploadToImgBB(MultipartFile image) {
	    RestTemplate restTemplate = new RestTemplate();

        byte[] imageBytes = null;
        try {
            imageBytes = image.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image bytes", e);
        }
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

	    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
	    body.add("key", imgbbApiKey);
	    body.add("image", base64Image);

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

	    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
	    

	    ResponseEntity<Map> response = restTemplate.postForEntity(imgbbUrl, requestEntity, Map.class);

	    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
	        Map data = (Map) response.getBody().get("data");

	        ImageUpload upload = new ImageUpload();
	        upload.setImageUrl(data.get("url").toString());
	        upload.setDeleteUrl(data.get("delete_url").toString());
	        

	        return upload;
	    } else {
	        throw new RuntimeException("Failed to upload image to ImgBB");
	    }
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
