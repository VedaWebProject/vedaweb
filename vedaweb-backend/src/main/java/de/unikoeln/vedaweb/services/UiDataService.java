package de.unikoeln.vedaweb.services;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.data.StanzaRepository;
import de.unikoeln.vedaweb.util.IOUtils;

@Service
public class UiDataService {
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	private StanzaRepository stanzaRepo;
	
	@Autowired
	private DataImportService importService;
	
	@Autowired JsonUtilService json;
	
	@Value("classpath:ui-data.json")
	private Resource uiDataTemplate;
	
	private ObjectNode uiData;
	
	
	@PostConstruct
	public ObjectNode init() {
		ObjectNode response = json.newNode();
		//force data import if db empty
		if (stanzaRepo.count() == 0) {
			System.out.println("[UiDataService] WARNING: DB collection seems to be empty. Trying to import data from XML...");
			response.put("importedXmlData", importService.importXMLData(DataImportService.LOCAL_XML_DIR, false));
		}
		//force index creation if index doesn't exist
		if (!indexService.indexExists()) {
			System.out.println("[UiDataService] WARNING: Could not request UI data. Search index doesn't seem to exist.");
			System.out.println("[UiDataService] Creating and filling new index...");
			response.set("indexCreated", indexService.createIndex());
			response.set("indexFilled", indexService.indexDbDocuments());
		}
		//build ui data
		response.put("builtUiData", buildUiData());
		return response;
	}

	public ObjectNode getUiDataJSON() {
		return uiData;
	}
	
	private String buildUiData() {
		uiData = json.newNode();
		
		//load ui data template file
		try {
			uiData = json.parse(IOUtils.convertStreamToString(uiDataTemplate.getInputStream()));
		} catch (IOException e) {
			System.err.println("[ERROR] UI data template JSON could not be loaded. (UiDataService)");
			return "[ERROR] UI data template JSON could not be loaded. (UiDataService)";
		}
		
		//get grammar tags data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/search/grammar"))
			.set("tags", indexService.getUIGrammarData());
		
		//get hymn count data for every book from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/search/meta"))
			.set("scopes", indexService.getUIBooksData());
		
		//get absolute hymn count data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/search/meta"))
			.set("hymnAbs", json.getMapper().valueToTree(indexService.getHymnAbsValues()));
		
		//get addressees data from index and add to uiData JSONObject
		((ObjectNode)uiData.findPath("meta"))
			.set("hymnAddressee", indexService.getStanzasMetaData("hymnAddressee"));
		
		//get group data from index and add to uiData JSONObject
		((ObjectNode)uiData.findPath("meta"))
			.set("hymnGroup", indexService.getStanzasMetaData("hymnGroup"));
		
		//get strata data from index and add to uiData JSONObject
		((ObjectNode)uiData.findPath("meta"))
			.set("strata", indexService.getStanzasMetaData("strata"));
		
		System.out.println("[UiDataService] Successfully initialized UI data object for frontend requests.");
		return "[UiDataService] Successfully initialized UI data object for frontend requests.";
	}

}
