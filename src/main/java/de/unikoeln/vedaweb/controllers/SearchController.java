package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.unikoeln.vedaweb.search.SearchRequest;
import de.unikoeln.vedaweb.services.SearchService;
import net.minidev.json.JSONObject;



@Controller
public class SearchController {
	
	@Autowired
	private SearchService search;
	
	
	@RequestMapping(value = "/search", method = RequestMethod.POST)
    public Model searchView(
    		@RequestBody SearchRequest searchRequest,
    		Model model,
    		HttpServletRequest request) {
		
		System.err.println(searchRequest);
    	
    	return model;
    }
	
	
//	@RequestMapping("/search")
//    public Model searchView(
//    		@RequestParam Map<String, String> params,
//    		Model model,
//    		HttpServletRequest request) {
//		
//		search.search(params);
//    	
//    	return model;
//    }

}
