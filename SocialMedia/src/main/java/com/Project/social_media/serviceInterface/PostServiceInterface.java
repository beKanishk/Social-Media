package com.Project.social_media.serviceInterface;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.Project.social_media.model.Post;
import com.Project.social_media.request.PostRequest;
import com.Project.social_media.response.PostResponse;

public interface PostServiceInterface {
	public PostResponse createPost(PostRequest postRequest, String jwt) throws Exception;
	
	public PostResponse deletePost(String jwt, Long postId) throws Exception;
	
	public List<Post> getAllPosts(String jwt) throws Exception;
	
	public Post getPost(Long postId);
	
	 Post createPost(String content, MultipartFile image, String jwt) throws Exception;
}
