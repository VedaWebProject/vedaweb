package de.unikoeln.vedaweb.search;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	
	@PostMapping(value = "/search", produces = {"application/json"})
    public String searchView(@RequestBody SearchData searchData) {
		//System.out.println(mappingService.mapObjectToJSON(searchData));
		return mappingService.mapObjectToJson(
				SearchHitsConverter.processSearchResponse(
						search.search(searchData)));
    }
	
}
