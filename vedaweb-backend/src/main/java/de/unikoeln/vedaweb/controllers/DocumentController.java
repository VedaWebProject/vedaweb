package de.unikoeln.vedaweb.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseLocation;
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
    public String verseById(
    		@PathVariable("id") String id) {
		
		//request for absolute hymn number?
		if (id.startsWith("hymnAbs_")) {
			return mappingService.mapObjectToJSON(
					verseRepo.findByHymnAbs(Integer.parseInt(id.replaceAll("\\D", ""))).get().get(0));
		}
		
		VerseLocation loc = new VerseLocation(id);
		Optional<Verse> v;
		
		while (!(v = verseRepo.findByBookAndHymnAndVerse(
				loc.getBook(), loc.getHymn(), loc.getVerse())).isPresent()) {
			loc.setNextFallbackLocation();
		}
		
		return mappingService.mapOptionalToJSON(v);
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String verseByLocation(@PathVariable int index) {
		return mappingService.mapOptionalToJSON(
				verseRepo.findByIndex( StringUtils.normalizeIndex(index, (int)verseRepo.count()) ));
    }
	
}
