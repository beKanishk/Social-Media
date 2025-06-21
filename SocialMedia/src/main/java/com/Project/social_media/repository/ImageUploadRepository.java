package com.Project.social_media.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.ImageUpload;
import com.Project.social_media.model.Post;
import com.Project.social_media.model.User;
import java.util.List;



public interface ImageUploadRepository extends JpaRepository<ImageUpload, Long>{
	public ImageUpload findByUser(User user);
	public ImageUpload findByPost(Post post);
}
