package de.unikoeln.vedaweb.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import de.unikoeln.vedaweb.data.Verse;
import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.JsonService;



@RestController
@RequestMapping("verse")
public class DocumentController {
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private JsonService jsonService;
	
	
	@RequestMapping(value = "/id/{id}", produces = {"application/json"})
    public String verseById(@PathVariable("id") String id) {
		return jsonService.mapToJSON(verseRepo.findById(id));
    }
	
	
	@RequestMapping(value = "/location/{location}", produces = {"application/json"})
    public String verseByLocation(@PathVariable("location") String location) {
		return jsonService.mapToJSON(verseRepo.findById(location));
    }
	
	
	@RequestMapping(value = "/index/{index}", produces = {"application/json"})
    public String verseByLocation(@PathVariable("index") int index) {
		return jsonService.mapToJSON(verseRepo.findByIndex(index));
    }
	
	
}
