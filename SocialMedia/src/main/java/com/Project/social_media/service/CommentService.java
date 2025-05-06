package com.Project.social_media.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Project.social_media.model.Comment;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import com.Project.social_media.repository.CommentRepository;
import com.Project.social_media.repository.PostRepository;
import com.Project.social_media.request.CommentRequest;
import com.Project.social_media.serviceInterface.CommentServiceInterface;

@Service
public class CommentService implements CommentServiceInterface{
	@Autowired
	PostRepository postRepository;
	
	@Autowired
	CommentRepository commentRepository;
	
	@Autowired
	UserService userService;
	
	@Override
	public List<Comment> getComment(Long postId) {
		List<Comment> comments = commentRepository.findByPostId(postId);
		return comments;
	}

	@Override
	public String createComment(CommentRequest request, String jwt) throws Exception {
		User user = userService.findUserProfileByJwt(jwt);
		Optional<Post> post = postRepository.findById(request.getPostId());
		
		Comment comment = new Comment();
		comment.setPost(post.get());
		comment.setCreatedAt(LocalDateTime.now().toString());
		comment.setMessage(request.getMessage());
		comment.setUser(user);
		
		commentRepository.save(comment);
		
		return "Comment created";
	}

	@Override
	public void deleteComment(Long commentId) throws Exception {
		commentRepository.deleteById(commentId);
	}

}
