package de.unikoeln.vedaweb.services;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.data.VerseRepository;
import de.unikoeln.vedaweb.util.IOUtils;

@Service
public class UiDataService {
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Autowired
	private VerseRepository verseRepo;
	
	@Autowired
	private DataImportService importService;
	
	@Value("classpath:ui-data.json")
	private Resource uiDataTemplate;
	
	private JSONObject uiData;
	
	
	@PostConstruct
	public JSONObject init() {
		JSONObject response = new JSONObject();
		//force data import if db empty
		if (verseRepo.count() == 0) {
			System.out.println("[UiDataService] WARNING: DB collection seems to be empty. Trying to import data from XML...");
			response.put("importedXmlData", importService.importXMLData(DataImportService.LOCAL_XML_DIR, false));
		}
		//force index creation if index doesn't exist
		if (!indexService.indexExists()) {
			System.out.println("[UiDataService] WARNING: Could not request UI data. Search index doesn't seem to exist.");
			System.out.println("[UiDataService] Creating and filling new index...");
			response.put("indexCreated", indexService.createIndex());
			response.put("indexFilled", indexService.indexDbDocuments());
		}
		//build ui data
		response.put("builtUiData", buildUiData());
		return response;
	}

	public JSONObject getUiDataJSON() {
		return uiData;
	}
	
	private String buildUiData() {
		uiData = new JSONObject();
		
		//load ui data template file
		try {
			uiData = new JSONObject(IOUtils.convertStreamToString(uiDataTemplate.getInputStream()));
		} catch (IOException e) {
			System.err.println("[ERROR] UI data template JSON could not be loaded. (UiDataService)");
			return "[ERROR] UI data template JSON could not be loaded. (UiDataService)";
		}
		
		//get grammar tags data from index and add to uiData JSONObject
		((JSONObject)uiData.query("/search/grammar"))
			.put("tags", indexService.getUIGrammarData());
		
		//get hymn count data for every book from index and add to uiData JSONObject
		((JSONObject)uiData.query("/search/meta"))
			.put("scopes", indexService.getUIBooksData());
		
		//get absolute hymn count data from index and add to uiData JSONObject
		((JSONObject)uiData.query("/search/meta"))
			.put("hymnAbs", indexService.getHymnAbsValues());
		
		//get addressees data from index and add to uiData JSONObject
		((JSONObject)uiData.query("/meta"))
			.put("hymnAddressee", indexService.getVersesMetaData("hymnAddressee"));
		
		//get group data from index and add to uiData JSONObject
		((JSONObject)uiData.query("/meta"))
			.put("hymnGroup", indexService.getVersesMetaData("hymnGroup"));
		
		//get strata data from index and add to uiData JSONObject
		((JSONObject)uiData.query("/meta"))
			.put("strata", indexService.getVersesMetaData("strata"));
		
		System.out.println("[UiDataService] Successfully initialized UI data object for frontend requests.");
		return "[UiDataService] Successfully initialized UI data object for frontend requests.";
	}

}
