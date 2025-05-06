package com.Project.social_media.serviceInterface;

import java.util.List;

import com.Project.social_media.model.Likes;

public interface LikesServiceInterface {
	public List<Likes> getLikes(Long postId) throws Exception;
	
	public String createLikes(String jwt, Long postId) throws Exception;
	
	public void deleteLike(String jwt, Long postId) throws Exception;
}
