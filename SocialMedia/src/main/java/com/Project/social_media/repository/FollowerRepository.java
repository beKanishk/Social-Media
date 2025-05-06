package com.Project.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.social_media.model.Followers;
import com.Project.social_media.model.User;

public interface FollowerRepository extends JpaRepository<Followers, Long>{
	public List<Followers> findByFollower(User follower);
	public List<Followers> findByFollowing(User following);
	public List<Followers> findByFollowerAndFollowing(User follower, User following);
	
	public boolean existsByFollowerAndFollowing(User follower, User following);
	
	public void deleteByFollowerAndFollowing(User follower, User following);
}
