package com.Project.social_media.configuration;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
	                               WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
	    if (request instanceof ServletServerHttpRequest servletRequest) {
	        String jwt = servletRequest.getServletRequest().getParameter("jwt");
	        System.out.println("Raw JWT: " + jwt);

	        if (jwt != null) {
	            try {
	                String email = JwtProvider.getEmailFromToken(jwt); // Validate + parse
	                attributes.put("email", email);
	                return true;
	            } catch (Exception e) {
	                System.out.println("Invalid JWT: " + e.getMessage());
	            }
	        } else {
	            System.out.println("JWT token not found in WebSocket handshake request");
	        }
	    }
	    return false; // reject handshake
	}

	
    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // Optional: Logging
    }
}
