package com.Project.social_media.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.Comment;
import java.util.List;


public interface CommentRepository extends JpaRepository<Comment, Long>{
	public List<Comment> findByPostId(Long postId);
	
	public List<Comment> findByUserId(Long userId);
}
