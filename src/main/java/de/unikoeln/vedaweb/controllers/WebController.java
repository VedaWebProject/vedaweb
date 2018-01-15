package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {
	
	
	@RequestMapping("/")
    public String app(
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println("[INFO] called '/', serving template 'app'.");
    	return "app";
    }
	
	
	@RequestMapping("/start")
    public String start(
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println("[INFO] called '/start', serving template 'start'.");
    	return "start";
    }
	
	
}
