package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.services.ElasticIndexService;
import de.unikoeln.vedaweb.services.JsonUtilService;
import de.unikoeln.vedaweb.services.UiDataService;



@RestController
@RequestMapping("api")
public class UiDataController {
	
	@Autowired
	private UiDataService uiDataService;
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	private JsonUtilService json;
	
	@RequestMapping(value = "/uidata", produces = {"application/json"})
    public String getUiDataJSON() {
		return uiDataService.getUiDataJSON().toString();
    }

	@RequestMapping(value = "/uidata/count/stanzas/{book}/{hymn}", produces = {"application/json"})
    public String getHymnCountJSON(@PathVariable("book") int book, @PathVariable("hymn") int hymn) {
		ObjectNode response = json.newNode();
		response.put("count", indexService.countStanzas(book, hymn));
		return response.toString();
    }
	
//	
//	@Autowired
//	private ElasticSearchService search;
//	
//	@Autowired
//	MongoTemplate mongoTemplate;
//	
//	
//	@RequestMapping(value = "/data/grammar/{field}", produces = {"application/json"})
//    public String valuesForField(
//    		@PathVariable("field") String field, 
//    		Model model,
//    		HttpServletRequest request) {
//		
//		System.out.println("[INFO] Aggregations requested: grammar fields");
//		JSONObject response = new JSONObject();
//		
//		try {
//			response.put("values",
//					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens." + field)));
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		
//    	return response.toString();
//    }
//	
//	
//	@RequestMapping(value = "/data/grammar", produces = {"application/json"})
//    public String valuesForAllGrammarFields(
//    		Model model,
//    		HttpServletRequest request) {
//		
//		System.out.println("[INFO] Aggregations requested: grammar fields");
//		JSONObject response = new JSONObject();
//		
//		try {
//			response.put("case",
//					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens.casus")));
//			response.put("mode",
//					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens.modus")));
//		} catch (JSONException e) {
//			e.printStackTrace();
//		}
//		
//    	return response.toString();
//    }
	
	
}
