package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.MappingService;
import de.unikoeln.vedaweb.util.StringUtils;


@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private MappingService mappingService;
	
	
	@RequestMapping(value = "/id/{id}", produces = {"application/json"})
    public String verseById(@PathVariable("id") String id) {
		return mappingService.mapOptionalToJSON(
				verseRepo.findById( StringUtils.normalizeId(id) ));
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String verseByLocation(@PathVariable("index") int index) {
		return mappingService.mapOptionalToJSON(
				verseRepo.findByIndex( StringUtils.normalizeIndex(index, (int)verseRepo.count()) ));
    }
	
}
