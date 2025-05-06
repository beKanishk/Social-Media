package com.Project.social_media.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.social_media.model.Likes;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.LikesRepository;
import com.Project.social_media.repository.PostRepository;
import com.Project.social_media.serviceInterface.LikesServiceInterface;

@Service
public class LikesService implements LikesServiceInterface{
	@Autowired
	LikesRepository likesRepository;
	
	@Autowired
	PostRepository postRepository;
	
	@Autowired
	UserService userService;
	
	@Override
	public List<Likes> getLikes(Long postId) throws Exception {
		Optional<Post> post = postRepository.findById(postId);
		
		if(post.get() != null) {
			List<Likes> likes = likesRepository.findByPost(post.get());
			return likes;
		}
		
		throw new Exception("Cannot find post with post id" + postId);
	}

	@Override
	public String createLikes(String jwt, Long postId) throws Exception {
	    User user = userService.findUserProfileByJwt(jwt);

	    Post post = postRepository.findById(postId)
	        .orElseThrow(() -> new Exception("Cannot find post with post id " + postId));

	    // Check if user already liked the post
	    Likes existingLike = likesRepository.findByUserAndPost(user, post);

	    if (existingLike != null) {
	        likesRepository.delete(existingLike);
	        return "Like removed";
	    } else {
	        Likes newLike = new Likes();
	        newLike.setCreatedAt(LocalDateTime.now().toString());
	        newLike.setPost(post);
	        newLike.setUser(user);

	        likesRepository.save(newLike);
	        return "Like added";
	    }
	}


	@Override
	public void deleteLike(String jwt, Long postId) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		Optional<Post> post = postRepository.findById(postId);
		
		if(post.get() != null) {
			Likes like = likesRepository.findByUserAndPost(user, post.get());
			likesRepository.delete(like);
			return;
		}
		throw new Exception("Cannot find post with post id" + postId);
	}
	
	
}
