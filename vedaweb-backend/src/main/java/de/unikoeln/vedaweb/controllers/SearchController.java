package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.search.SearchData;
import de.unikoeln.vedaweb.search.SearchHitsConverter;
import de.unikoeln.vedaweb.services.ElasticSearchService;
import de.unikoeln.vedaweb.services.MappingService;



@RestController
@RequestMapping("api")
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private MappingService mappingService;
	
	
	@PostMapping(value = "/search", produces = {"application/json"})
    public String searchView(@RequestBody SearchData searchData) {
		
		return mappingService.mapObjectToJSON(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
}
