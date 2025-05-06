package com.Project.social_media.serviceInterface;

import java.util.List;

import com.Project.social_media.model.Comment;
import com.Project.social_media.request.CommentRequest;

public interface CommentServiceInterface {
	public List<Comment> getComment(Long postId);
	
	public String createComment(CommentRequest request, String jwt) throws Exception;
	
	public void deleteComment(Long commentId) throws Exception;
}
