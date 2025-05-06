package com.Project.social_media.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.User;
import java.util.List;


public interface UserRepository extends JpaRepository<User, Long>{
	User findByUserEmail(String email);
	User findByUserName(String userName);
	List<User> findByUserNameContainingIgnoreCase(String userName);

}
