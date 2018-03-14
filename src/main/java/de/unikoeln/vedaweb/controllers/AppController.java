package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class AppController {
	
	
	@RequestMapping("/")
    public String app(
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println("[INFO] called '/', serving app frontend.");
    	return "index";
    }
	
}
