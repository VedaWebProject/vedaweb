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
		return mappingService.mapToJSON(verseRepo.findById( normalizeId(id) ));
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String verseByLocation(@PathVariable("index") int index) {
		return mappingService.mapToJSON(verseRepo.findByIndex( normalizeIndex(index) ));
    }
	
	
	private String normalizeId(String id){
		if (id.matches("\\d{7}"))
			return id;
		else if (id.matches("\\D*\\d{2}\\D\\d{3}\\D\\d{2}\\D*"))
			id = id.replaceAll("\\D", "");
		else
			id = constructId(id);
		return id;
	}
	
	
	private String constructId(String input){
		String[] digits = input.split("\\D+");
		if (digits.length != 3) return "invalid";
		
		StringBuffer sb = new StringBuffer();
		
		sb.append(String.format("%02d", Integer.parseInt(digits[0])));
		sb.append(String.format("%03d", Integer.parseInt(digits[1])));
		sb.append(String.format("%02d", Integer.parseInt(digits[2])));
		
		return sb.toString();
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
