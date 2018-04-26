package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.MappingService;



@RestController
@RequestMapping("api/document")
public class DocumentController {
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private MappingService mappingService;
	
	
	@RequestMapping(value = "/id/{id}", produces = {"application/json"})
    public String verseById(@PathVariable("id") String id) {
		
		if (id.matches("[\\d\\.\\s]+")) id = id.replaceAll("\\D", "");
		
		return mappingService.mapToJSON(verseRepo.findById(id));
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String verseByLocation(@PathVariable("index") int index) {
		return mappingService.mapToJSON(
			verseRepo.findByIndex(normalizeIndex(index))
		);
    }
	
	
	private int normalizeIndex(int index){
		int docCount = (int)verseRepo.count();
		if (index < 0)
			index = docCount + index;
		else if (index >= verseRepo.count())
			index = index - docCount;
		return index;
	}
	
}
