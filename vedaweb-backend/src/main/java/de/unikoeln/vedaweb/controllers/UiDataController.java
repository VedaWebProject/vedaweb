package de.unikoeln.vedaweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.search.IndexService;
import de.unikoeln.vedaweb.uidata.UiDataService;
import de.unikoeln.vedaweb.util.JsonUtilService;
import io.swagger.v3.oas.annotations.Hidden;


/**
 * Controller handling UI data requests
 * 
 * @author bkis
 *
 */
@RestController
@RequestMapping("api")
@Hidden
public class UiDataController {
	
	@Autowired
	private UiDataService uiDataService;
	
	@Autowired
	private IndexService indexService;
	
	@Autowired
	private JsonUtilService json;
	
	/**
	 * Returns application UI data
	 * @return
	 */
	@RequestMapping(value = "/uidata", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getUiDataJSON() {
		return uiDataService.getUiDataJSON().toString();
    }

	/**
	 * Returns number of stanzas in given hymn
	 * @param book
	 * @param hymn
	 * @return
	 */
	@RequestMapping(value = "/uidata/count/stanzas/{book}/{hymn}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getStanzaCountJSON(@PathVariable("book") int book, @PathVariable("hymn") int hymn) {
		ObjectNode response = json.newObjectNode();
		response.put("count", indexService.countStanzas(book, hymn));
		return response.toString();
    }
	
}
