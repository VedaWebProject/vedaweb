package de.unikoeln.vedaweb.controllers;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.services.DataImportService;
import de.unikoeln.vedaweb.services.ElasticIndexService;
import de.unikoeln.vedaweb.services.UiDataService;



@RestController
@RequestMapping("system")
@PropertySource(value = "classpath:application.properties")
public class SystemController {
	
	@Value("${vw.system.auth}")
	private String auth;
	
	@Autowired
	private DataImportService dataImportService;
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	private UiDataService uiDataService;
	
	
	@GetMapping(value = {"/index/{action}"}, produces = {"application/json"})
    public String stanzaById(
    		@PathVariable(name = "action") String action,
    		@RequestParam(name = "auth", required = false) String auth) {
		
		JSONObject response = new JSONObject();
		
		if (!auth(auth)) {
			response.put("error", "authentication failed");
			return response.toString();
		}
					
		switch (action){
		case "delete":
			response.put("indexDelete", indexService.deleteIndex());
			break;
		case "create":
			response.put("indexCreate", indexService.createIndex());
			break;
		case "fill":
			response.put("indexFill", indexService.indexDbDocuments());
			break;
		case "rebuild":
			response.put("indexRebuild", indexService.rebuildIndex());
			break;
		default:
			response.put("error", "unknown command");
			break;
		}
		return response.toString();
    }
	
	@GetMapping(value = {"/import/{dryRun}", "/import"}, produces = {"application/json"})
    public String importData(
    		@PathVariable(name = "dryRun", required = false) String dryRun,
    		@RequestParam(name = "auth", required = false) String auth) {
		
		if (!auth(auth))
			return "{error:'authentication failed'}";
		
		boolean dry = dryRun != null;
		int docCount = dataImportService.importXMLData(DataImportService.LOCAL_XML_DIR, dry);
		JSONObject response = new JSONObject();
		response.put("dryRun", dry);
		response.put("importedDocsCount", docCount);
		//if (!dry) response.put("indexActions", indexService.rebuildIndex());
		return response.toString();
    }
	
	@GetMapping(value = {"/uidata/refresh"}, produces = {"application/json"})
    public String importData(
    		@RequestParam(name = "auth", required = false) String auth) {
		
		if (!auth(auth))
			return "{error:'authentication failed'}";
		
		return uiDataService.init().toString();
    }
	
	private boolean auth(String auth) {
		return auth != null && auth.equals(this.auth);
	}
	
}
