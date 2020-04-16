package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.search.ElasticSearchService;
import de.unikoeln.vedaweb.search.GrammarSearchOccurrences;
import de.unikoeln.vedaweb.search.SearchHits;
import de.unikoeln.vedaweb.search.SearchHitsConverter;
import de.unikoeln.vedaweb.search.grammar.GrammarSearchData;
import de.unikoeln.vedaweb.search.metrical.MetricalSearchData;
import de.unikoeln.vedaweb.search.quick.QuickSearchData;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@RestController
@RequestMapping("api/search")
@Api(consumes = MediaType.APPLICATION_JSON_VALUE)
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	
	@ApiOperation(
			value = "Quick search API endpoint",
			response = SearchHits.class)
	@PostMapping(
			value = "/quick",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchQuick(@RequestBody QuickSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	
	@ApiOperation(
			value = "Grammar search API endpoint",
			response = SearchHits.class)
	@PostMapping(
			value = "/grammar",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchGrammar(@RequestBody GrammarSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	
	@ApiOperation(
			value = "Metrical search API endpoint",
			response = SearchHits.class)
	@PostMapping(
			value = "/metrical",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchMetrical(@RequestBody MetricalSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	
	@ApiOperation(
			value = "Get the total occurrences count of a single block grammar search query",
			response = GrammarSearchOccurrences.class)
	@PostMapping(
			value = "/occ",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public GrammarSearchOccurrences searchOcc(@RequestBody GrammarSearchData searchData) {
		return new GrammarSearchOccurrences(
						SearchHitsConverter.processSearchResponse(
								search.searchOcc(searchData)));
    }
	
}
