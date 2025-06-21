package com.Project.social_media.service;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.Project.social_media.configuration.JwtProvider;
import com.Project.social_media.model.ImageUpload;
import com.Project.social_media.model.User;
import com.Project.social_media.model.UserDetailsDTO;
import com.Project.social_media.repository.ImageUploadRepository;
import com.Project.social_media.repository.UserRepository;


@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ImageUploadRepository imageUploadRepository;
	
	@Value("${imgbb.api.key}")
    private String imgbbApiKey;

	@Value("${image.url}")
	private String imgbbUrl;
	
	public User findUserProfileByJwt(String jwt) throws Exception {
		String email = JwtProvider.getEmailFromToken(jwt);
		User user = userRepository.findByUserEmail(email);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}
	
	public List<User> searchUsersByUsername(String query) {
	    return userRepository.findByUserNameContainingIgnoreCase(query);
	}

	public User findByUsername(String userName) throws Exception {
		User user = userRepository.findByUserName(userName);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}
	
	
	public User findUserByEmail(String email) throws Exception {
		User user = userRepository.findByUserEmail(email);
		
		if(user == null) {
			throw new Exception("User not found exception.");
		}
		
		return user;
	}

	
	public User findUserById(Long id) throws Exception {
		Optional<User> user = userRepository.findById(id);
		if(user.isEmpty()) {
			throw new Exception("User not found exception.");
		}
		return user.get();
	}
	
	public User editUserDetails(User user, UserDetailsDTO userDetailsDTO, MultipartFile image) throws IOException {
	    if (userDetailsDTO.getBio() != null) {
	        user.setBio(userDetailsDTO.getBio());
	    }
	    if (userDetailsDTO.getName() != null) {
	        user.setName(userDetailsDTO.getName());
	    }
	    if (userDetailsDTO.getUserName() != null) {
	        user.setUserName(userDetailsDTO.getUserName());
	    }
	    if (userDetailsDTO.getUserEmail() != null) {
	        user.setUserEmail(userDetailsDTO.getUserEmail());
	    }
	    if (userDetailsDTO.getAbout() != null) {
	        user.setAbout(userDetailsDTO.getAbout());
	    }

	    if (image != null && !image.isEmpty()) {
	        // Upload to imgbb and get full response
	        Map<String, String> imgbbData = uploadToImgBB(image); // Change return type to Map<String, String>
	        String imageUrl = imgbbData.get("url");
	        String deleteUrl = imgbbData.get("delete_url");

	        // Update user profile picture URL
	        user.setProfilePictureUrl(imageUrl);

	        // Save ImageUpload record
	        ImageUpload imageUpload = new ImageUpload();
	        imageUpload.setUser(user);
	        imageUpload.setImageUrl(imageUrl);
	        imageUpload.setDeleteUrl(deleteUrl);
	        imageUploadRepository.save(imageUpload);
	    }

	    return userRepository.save(user);
	}


	public void clearUserDetails(User user, UserDetailsDTO userDetailsDTO, boolean clearImage) throws Exception {
	    if (clearImage) {
	        if (user.getProfilePictureUrl() != null) {
	            // Find and delete the image record
	            ImageUpload image = imageUploadRepository.findByUser(user);
	            if (image != null) {
	                // Delete from Imgbb if you stored delete_url
	                String deleteUrl = image.getDeleteUrl();
	                if (deleteUrl != null) {
	                    try {
	                    	// ImgBB deletion is done via GET request
	                        RestTemplate restTemplate = new RestTemplate();
	                        ResponseEntity<String> response = restTemplate.getForEntity(deleteUrl, String.class);

	                        if (response.getStatusCode().is2xxSuccessful()) {
	                            System.out.println("Image deleted from ImgBB successfully.");
	                        } else {
	                            System.out.println("Failed to delete image from ImgBB: " + response.getStatusCode());
	                        }
	                    } catch (Exception e) {
	                        System.out.println("Failed to delete image from Imgbb: " + e.getMessage());
	                    }
	                }

	                // Remove from DB
	                imageUploadRepository.delete(image);
	            }

	            user.setProfilePictureUrl(null);
	        }
	    }

//	    if (userDetailsDTO != null) {
//	    		if(userDetailsDTO.getName() != null)
//	    			user.setName(userDetailsDTO.getName());
//	    		
//	            user.setBio(userDetailsDTO.getBio());
//	            
//	            if(userDetailsDTO.getUserName() != null)
//	            	user.setUserName(userDetailsDTO.getUserName());
//	            
//	            if(userDetailsDTO.getUserEmail() != null)
//	            	user.setUserEmail(userDetailsDTO.getUserEmail());
//	            
//	            user.setAbout(userDetailsDTO.getAbout());
//	    }

	    userRepository.save(user);
	}

	
//	private String uploadToImgBB(MultipartFile image) throws IOException {
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Convert image to Base64
//        byte[] imageBytes = image.getBytes();
//        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//
//        // Prepare request body
//        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//        body.add("key", imgbbApiKey);
//        body.add("image", base64Image);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
//
//        // Send POST request
//        String imgbbUrl = "https://api.imgbb.com/1/upload";
//        ResponseEntity<Map> response = restTemplate.postForEntity(imgbbUrl, requestEntity, Map.class);
//
//        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
//            Map data = (Map) response.getBody().get("data");
//            return data.get("url").toString(); // public image URL
//        } else {
//            throw new RuntimeException("Failed to upload image to Imgbb");
//        }
//    }
	
	private Map<String, String> uploadToImgBB(MultipartFile image) throws IOException {
	    RestTemplate restTemplate = new RestTemplate();

	    byte[] imageBytes = image.getBytes();
	    String base64Image = Base64.getEncoder().encodeToString(imageBytes);

	    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
	    body.add("key", imgbbApiKey);
	    body.add("image", base64Image);

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

	    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

	    
	    ResponseEntity<Map> response = restTemplate.postForEntity(imgbbUrl, requestEntity, Map.class);

	    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
	        Map data = (Map) response.getBody().get("data");
	        String url = data.get("url").toString();
	        String deleteUrl = data.get("delete_url").toString();

	        Map<String, String> result = new HashMap<>();
	        result.put("url", url);
	        result.put("delete_url", deleteUrl);
	        return result;
	    } else {
	        throw new RuntimeException("Failed to upload image to Imgbb");
	    }
	}

}
