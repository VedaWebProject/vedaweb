package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import de.unikoeln.vedaweb.data.VerseDocument;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchRequest;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.services.SearchService;



@Controller
public class SearchController {
	
	@Autowired
	private SearchService search;
	
	@Autowired
	private VerseRepository verseRepo;
	
	
	@RequestMapping(value = "/search", method = RequestMethod.POST)
    public String searchView(
    		SearchRequest searchRequest,
    		Model model,
    		HttpServletRequest request) {
		
		System.err.println(searchRequest);
		
		SearchResults results = search.search(searchRequest);
		model.addAttribute("results", results);
		
		System.err.println(results);
    	
    	return "search";
    }
	
	
	@RequestMapping("/verse")
    public String verse(
    		@RequestParam String id,
    		Model model,
    		HttpServletRequest request) {
		
		VerseDocument verse = verseRepo.findById(id);
		System.out.println(verse);
		
		model.addAttribute("verse", verse);
		
		System.out.println("[INFO] called '/verse', serving template 'verse'.");
    	return "content";
    }
	
	
//	@RequestMapping(value = "/search", method = RequestMethod.GET)
//  public Model searchView(
//  		@RequestBody SearchRequest searchRequest,
//  		Model model,
//  		HttpServletRequest request) {
//		
//		searchRequest.cleanAndFormatFields();
//		System.err.println(searchRequest);
//		
//		SearchResults results = search.search(searchRequest);
//		model.addAttribute("results", results);
//		
//		System.err.println(results);
//  	
//  	return model;
//  }
	
	
//	@RequestMapping("/search")
//    public Model searchView(
//    		@RequestParam Map<String, String> params,
//    		Model model,
//    		HttpServletRequest request) {
//		
//		System.err.println(params);
//		model.addAttribute("results", search.search(params));
//    	
//    	return model;
//    }
	
//	@RequestMapping("/search")
//    public Model searchView(
//    		@RequestParam String req,
//    		Model model,
//    		HttpServletRequest request) {
//		
//		ObjectMapper mapper = new ObjectMapper();
//		SearchRequest sr = null;
//		
//		try {
//			sr = mapper.readValue(Base64Utils.decodeFromString(req), SearchRequest.class);
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		
//		System.err.println(sr);
//		sr.cleanAndFormatFields();
//		System.err.println(sr);
//		
//		model.addAttribute("results", search.search(sr).getSortedResultsList());
//    	
//    	return model;
//    }

}
