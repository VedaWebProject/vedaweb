package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.search.SearchService;
import de.unikoeln.vedaweb.search.SearchHits;
import de.unikoeln.vedaweb.search.SearchHitsConverter;
import de.unikoeln.vedaweb.search.grammar.GrammarSearchData;
import de.unikoeln.vedaweb.search.grammar.GrammarSearchOccurrences;
import de.unikoeln.vedaweb.search.metrical.MetricalSearchData;
import de.unikoeln.vedaweb.search.metricalposition.MetricalPositionSearchData;
import de.unikoeln.vedaweb.search.quick.QuickSearchData;
import io.swagger.v3.oas.annotations.Operation;


/**
 * Controller for handling search requests
 * 
 * @author bkis
 *
 */
@RestController
@RequestMapping("api/search")
public class SearchController {
	
	@Autowired
	private SearchService search;
	
	
	/**
	 * Quick search endpoint
	 * @param searchData
	 * @return
	 */
	@Operation(summary = "Quick search API endpoint")
	@PostMapping(
			value = "/quick",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchQuick(@RequestBody QuickSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	/**
	 * Advanced: Grammar search endpoint
	 * @param searchData
	 * @return
	 */
	@Operation(summary = "Grammar search API endpoint")
	@PostMapping(
			value = "/grammar",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchGrammar(@RequestBody GrammarSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	/**
	 * Advanced: Metrical pattern search endpoint
	 * @param searchData
	 * @return
	 */
	@Operation(summary = "Metrical pattern search API endpoint")
	@PostMapping(
			value = "/metrical",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchMetrical(@RequestBody MetricalSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	/**
	 * Advanced: Metrical position search endpoint
	 * @param searchData
	 * @return
	 */
	@Operation(summary = "Metrical position search API endpoint")
	@PostMapping(
			value = "/metricalPosition",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public SearchHits searchMetricalPosition(@RequestBody MetricalPositionSearchData searchData) {
		return SearchHitsConverter
				.processSearchResponse(search.search(searchData));
    }
	
	/**
	 * Advanced: Grammar search occ count
	 * @param searchData
	 * @return
	 */
	@Operation(summary = "Get the total occurrences count of a single block grammar search query")
	@PostMapping(
			value = "/occ",
			produces = MediaType.APPLICATION_JSON_VALUE)
    public GrammarSearchOccurrences searchOcc(@RequestBody GrammarSearchData searchData) {
		return new GrammarSearchOccurrences(
						SearchHitsConverter.processSearchResponse(
								search.searchOcc(searchData)));
    }
	
}
