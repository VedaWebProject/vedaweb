package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.ElasticSearchService;
import de.unikoeln.vedaweb.services.MappingService;
import de.unikoeln.vedaweb.util.RequestTransformUtils;



@RestController
@RequestMapping("api/search")
public class SmartSearchController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private MappingService mappingService;
	
	
	@RequestMapping(value = "/smart/{input}", method = RequestMethod.GET, produces = {"application/json"})
    public String smartSearch(@PathVariable("input") String input) {
		
		if (RequestTransformUtils.isQueryForLocation(input)){
			return mappingService.mapOptionalToJSON(
					verseRepo.findById(RequestTransformUtils.normalizeId(input)));
		} else {
			return search.smartSearch(RequestTransformUtils.normalizeNFD(input)).toString();
		}
    }
	
}
