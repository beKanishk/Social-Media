package com.Project.social_media.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Project.social_media.model.Message;
import com.Project.social_media.model.User;

public interface MessageRepository extends JpaRepository<Message, Long>{
	public List<Message> findByReceiver(User receiver);
	public List<Message> findBySender(User sender);
	
	@Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.createdAt")
	List<Message> findConversation(@Param("user1") User user1, @Param("user2") User user2);

	public List<Message> findByReceiverAndSender(User receiver, User sender);
}
