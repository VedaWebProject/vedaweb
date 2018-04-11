package de.unikoeln.vedaweb.controllers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.DataImportService;

@RestController
public class AppController {
	
	@Autowired
	DataImportService dataImportService;
	
	@Autowired
	VerseRepository verseRepo;
	
	
	@RequestMapping(value = "/data/import", produces = {"application/json"})
    public String importData() {
		dataImportService.importXMLData(DataImportService.DEV_LOCAL_XML);
    	return "VERSES: " + verseRepo.count();
    }
	
}
