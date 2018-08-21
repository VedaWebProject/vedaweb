package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.services.DataImportService;
import de.unikoeln.vedaweb.services.ElasticIndexService;



@RestController
@RequestMapping("system")
public class SystemController {
	
	@Autowired
	DataImportService dataImportService;
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	VerseRepository verseRepo;
	
	
	@RequestMapping(value = "/index/{action}", produces = {"application/json"})
    public String verseById(@PathVariable("action") String action) {
		switch (action){
		case "delete":
			return indexService.deleteIndex().toString();
		case "create":
			return indexService.createIndex().toString();
		case "fill":
			return indexService.indexDbDocuments().toString();
		default:
			return "{response:'unknown command'}";
		}
    }
	
	
	@RequestMapping(value = "/data/import/{dryRun}", produces = {"application/json"})
    public String importData(@PathVariable("dryRun") String dryRun) {
		dataImportService.importXMLData(DataImportService.DEV_LOCAL_XML, dryRun.equals("true"));
    	return "{'verses':" + verseRepo.count() + "}";
    }
	
	
	@RequestMapping(value = "/mapping/grammar", produces = {"application/json"})
    public String mappingGrammar() {
		return indexService.getGrammarMapping().toString();
    }
	
	
}
