package de.unikoeln.vedaweb.controllers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.services.DataImportService;
import de.unikoeln.vedaweb.services.ElasticIndexService;



@RestController
@RequestMapping("system")
public class SystemController {
	
	@Autowired
	DataImportService dataImportService;
	
	@Autowired
	private ElasticIndexService indexService;
	
//	@Autowired
//	VerseRepository verseRepo;
	
	
	@RequestMapping(value = "/index/{action}", produces = {"application/json"})
    public String verseById(@PathVariable("action") String action) {
		switch (action){
		case "delete":
			return indexService.deleteIndex().toString();
		case "create":
			return indexService.createIndex().toString();
		case "fill":
			return indexService.indexDbDocuments().toString();
		case "refresh":
			return indexService.rebuildIndex().toString();
		default:
			return "{\"response\":\"unknown command\"}";
		}
    }
	
	@GetMapping(value = {"/import/{dryRun}", "/import"}, produces = {"application/json"})
    public String importData(@PathVariable(name = "dryRun", required = false) String dryRun) {
		boolean dry = dryRun != null;
		int docCount = dataImportService.importXMLData(DataImportService.LOCAL_XML, dry);
		JSONObject response = new JSONObject();
		response.put("dryRun", dry);
		response.put("importedDocsCount", docCount);
		if (!dry) response.put("indexActions", indexService.rebuildIndex());
		return response.toString();
    }
	
}
