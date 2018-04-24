package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.search.SearchDataAdvanced;
import de.unikoeln.vedaweb.search.SearchDataSimple;
import de.unikoeln.vedaweb.services.ElasticSearchService;
import de.unikoeln.vedaweb.services.MappingService;



@RestController
@RequestMapping("search")
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private MappingService mappingService;
	
	
	@RequestMapping(value = "/simple", method = RequestMethod.POST, produces = {"application/json"})
    public String searchView(@RequestBody SearchDataSimple searchData) {
		
		System.out.println(searchData);
		//SearchResults results = search.search(searchData);
		
    	return mappingService.mapObjectToJSON(searchData);
    }
	
	
	@RequestMapping(value = "/advanced", method = RequestMethod.POST, produces = {"application/json"})
    public String searchView(@RequestBody SearchDataAdvanced searchData) {
		
		System.out.println(searchData);
		//SearchResults results = search.search(searchData);
		
    	return mappingService.mapObjectToJSON(searchData);
    }
	
}
