package de.unikoeln.vedaweb.controllers;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import de.unikoeln.vedaweb.services.ElasticSearchService;



@RestController
public class UIDataController {
	
	@Autowired
	private ElasticSearchService search;
	
	@Autowired
	MongoTemplate mongoTemplate;
	
	
	@RequestMapping(value = "/data/grammar/{field}", produces = {"application/json"})
    public String valuesForField(
    		@PathVariable("field") String field, 
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println("[INFO] Aggregations requested: grammar fields");
		JSONObject response = new JSONObject();
		
		try {
			response.put("values",
					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens." + field)));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
    	return response.toString();
    }
	
	
	@RequestMapping(value = "/data/grammar", produces = {"application/json"})
    public String valuesForAllGrammarFields(
    		Model model,
    		HttpServletRequest request) {
		
		System.out.println("[INFO] Aggregations requested: grammar fields");
		JSONObject response = new JSONObject();
		
		try {
			response.put("case",
					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens.casus")));
			response.put("mode",
					new JSONArray(mongoTemplate.getCollection("merged").distinct("parts.tokens.modus")));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
    	return response.toString();
    }
	
	
}
