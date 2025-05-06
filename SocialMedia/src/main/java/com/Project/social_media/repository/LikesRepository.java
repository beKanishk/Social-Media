package com.Project.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.Likes;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;

public interface LikesRepository extends JpaRepository<Likes, Long>{
//	public Likes findByUserIdAndPostId(Long userId, Long postId);
	public Likes findByUserAndPost(User user, Post post);
	public List<Likes> findByPost(Post post);
}
