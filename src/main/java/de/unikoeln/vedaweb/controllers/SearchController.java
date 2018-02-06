package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.search.SeachFormData;
import de.unikoeln.vedaweb.services.ElasticSearchService;



@Controller
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private VerseRepository verseRepo;
	
	
	@RequestMapping(value = "/search", method = RequestMethod.POST)
    public String searchView(
    		@RequestBody SeachFormData formData,
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println(formData);
		
		SearchResults results = search.search(formData);
		model.addAttribute("results", results);
		
    	return "search";
    }
	
	
	@RequestMapping("/verse")
    public String verse(
    		@RequestParam String index,
    		@RequestParam(required=false) Integer mod,
    		Model model,
    		HttpServletRequest request) {
		
		model.addAttribute("verse", verseRepo.findByIndex(index));
		
		System.out.println("[INFO] called '/verse', serving template 'content'.");
    	return "content";
    }
	
	
}
