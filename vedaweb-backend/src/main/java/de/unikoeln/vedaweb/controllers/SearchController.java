package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.search.ElasticSearchService;
import de.unikoeln.vedaweb.search.GrammarSearchOccurrences;
import de.unikoeln.vedaweb.search.SearchData;
import de.unikoeln.vedaweb.search.SearchHits;
import de.unikoeln.vedaweb.search.SearchHitsConverter;
import de.unikoeln.vedaweb.util.JsonUtilService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@RestController
@RequestMapping("api/search")
@Api(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private JsonUtilService mappingService;
	
	
	@ApiOperation(
			value = "Search for stanzas",
			response = SearchHits.class)
	@PostMapping(
			value = "",
			produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String search(@RequestBody SearchData searchData) {
		//System.out.println(mappingService.mapObjectToJson(searchData));
		return mappingService.mapObjectToJsonString(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
	
	@ApiOperation(
			value = "Get the total occurrences count of a single block grammar search query",
			response = GrammarSearchOccurrences.class)
	@PostMapping(
			value = "/occ",
			produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String searchOcc(@RequestBody SearchData searchData) {
		//System.out.println(mappingService.mapObjectToJson(searchData));
		return mappingService.mapObjectToJsonString(
				new GrammarSearchOccurrences(
						SearchHitsConverter.processSearchResponse(
								search.searchOcc(searchData))));
    }
	
}
