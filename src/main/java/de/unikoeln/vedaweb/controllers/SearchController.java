package de.unikoeln.vedaweb.controllers;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchFormData;
import de.unikoeln.vedaweb.search.SearchResults;
import de.unikoeln.vedaweb.services.ElasticSearchService;
import de.unikoeln.vedaweb.services.JsonService;



@RestController
@RequestMapping("search")
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private JsonService jsonService;
	
	
	@RequestMapping(value = "/", method = RequestMethod.POST, produces = {"application/json"})
    public String searchView(@RequestBody SearchFormData formData) {
		
		System.out.println(formData);
		SearchResults results = search.search(formData);
		
    	return jsonService.mapToJSON(results);
    }
	
}
