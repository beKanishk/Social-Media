package com.Project.social_media.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Autowired
	private JwtHandshakeInterceptor jwtInterceptor;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
	    registry.addEndpoint("/ws")
	            .setAllowedOriginPatterns("*")
	            .addInterceptors(jwtInterceptor)
	            .setHandshakeHandler(new CustomHandshakeHandler()) // Add this
	            .withSockJS();
	}


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user"); // For private messages
        registry.setApplicationDestinationPrefixes("/app"); // For message sending
        registry.setUserDestinationPrefix("/user"); // Enables /user/{user name}/... support
    }
}

