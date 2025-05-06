package com.Project.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;


public interface PostRepository extends JpaRepository<Post, Long>{
	Post findByUserId(Long userId);
	
	List<Post> findAllByUserId(Long userId);
	
	List<Post> findByUserAndArchievePostFalse(User user);
}
