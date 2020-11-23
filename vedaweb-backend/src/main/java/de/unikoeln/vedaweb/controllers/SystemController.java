package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.dataimport.DataImportService;
import de.unikoeln.vedaweb.logging.ClientError;
import de.unikoeln.vedaweb.logging.ClientErrorRepository;
import de.unikoeln.vedaweb.search.IndexService;
import de.unikoeln.vedaweb.uidata.UiDataService;
import de.unikoeln.vedaweb.util.JsonUtilService;
import springfox.documentation.annotations.ApiIgnore;


/**
 * Controller for handling system maintenance actions
 * 
 * @author bkis
 *
 */
@RestController
@RequestMapping("system")
@ApiIgnore
public class SystemController {
	
	@Value("${vedaweb.system.auth}")
	private String auth;
	
	@Autowired
	private DataImportService dataImportService;
	
	@Autowired
	private IndexService indexService;
	
	@Autowired
	private UiDataService uiDataService;
	
	@Autowired
	private JsonUtilService json;
	
	@Autowired
	private ClientErrorRepository clientErrorRepo;
	
	/**
	 * Index actions
	 * 
	 * @param action
	 * @param auth
	 * @return
	 */
	@GetMapping(value = {"/index/{action}"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public String index(
    		@PathVariable(name = "action") String action,
    		@RequestParam(name = "auth", required = false) String auth) {
		
		ObjectNode response = json.newObjectNode();
		
		if (!auth(auth)) {
			response.put("error", "authentication failed");
			return response.toString();
		}
					
		switch (action){
		case "delete":
			response.set("indexDelete", indexService.deleteIndex());
			break;
		case "create":
			response.set("indexCreate", indexService.createIndex());
			break;
		case "fill":
			response.set("indexFill", indexService.indexDbDocuments());
			break;
		case "rebuild":
			response.set("indexRebuild", indexService.rebuildIndex());
			break;
		default:
			response.put("error", "unknown command");
			break;
		}
		return response.toString();
    }
	
	/**
	 * Data import
	 * 
	 * @param dryRun
	 * @param auth
	 * @return
	 */
	@GetMapping(value = {"/import/{dryRun}", "/import"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public String importData(
    		@PathVariable(name = "dryRun", required = false) String dryRun,
    		@RequestParam(name = "auth", required = false) String auth) {
		
		if (!auth(auth))
			return "{error:'authentication failed'}";
		
		boolean dry = dryRun != null;
		int docCount = dataImportService.importXMLData(dry);
		ObjectNode response = json.newObjectNode();
		response.put("dryRun", dry);
		response.put("importedDocsCount", docCount);
		//if (!dry) response.put("indexActions", indexService.rebuildIndex());
		return response.toString();
    }
	
	/**
	 * Refresh UI data
	 * 
	 * @param auth
	 * @return
	 */
	@GetMapping(value = {"/uidata/refresh"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public String uiData(
    		@RequestParam(name = "auth", required = false) String auth) {
		
		if (!auth(auth))
			return "{error:'authentication failed'}";
		
		return uiDataService.init().toString();
    }
	
	/**
	 * Receives client error data
	 * 
	 * @param errorData
	 * @return
	 */
	@PostMapping(value = {"/error"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ClientError reportClientError(@RequestBody ClientError errorData) {
		return clientErrorRepo.insert(errorData);
    }
	
	/**
	 * Checks auth phrase (yes, this is very primitive)
	 * 
	 * @param auth
	 * @return
	 */
	private boolean auth(String auth) {
		return auth != null && auth.equals(this.auth);
	}
	
}
