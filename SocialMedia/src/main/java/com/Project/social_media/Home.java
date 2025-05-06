package com.Project.social_media;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class Home {
	@GetMapping
	public String home() {
		return "Welcome to home";
	}
}
