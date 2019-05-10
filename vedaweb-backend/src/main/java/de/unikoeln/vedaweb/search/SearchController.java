package de.unikoeln.vedaweb.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.util.JsonUtilService;



@RestController
@RequestMapping("api")
public class SearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private JsonUtilService mappingService;
	
	
	@PostMapping(value = "/search", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String searchView(@RequestBody SearchData searchData) {
		//System.out.println(mappingService.mapObjectToJson(searchData));
		return mappingService.mapObjectToJson(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
	
	@PostMapping(value = "/search/occ", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String searchOccView(@RequestBody SearchData searchData) {
		//System.out.println(mappingService.mapObjectToJson(searchData));
		return mappingService.mapObjectToJson(
				new GrammarSearchOccurrences(
						SearchHitsConverter.processSearchResponse(
								search.searchOcc(searchData))));
    }
	
}
