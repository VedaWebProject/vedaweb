package de.unikoeln.vedaweb.uidata;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.node.ObjectNode;

import de.unikoeln.vedaweb.document.StanzaRepository;
import de.unikoeln.vedaweb.search.ElasticIndexService;
import de.unikoeln.vedaweb.util.HtmlSnippetsLoader;
import de.unikoeln.vedaweb.util.IOUtils;
import de.unikoeln.vedaweb.util.JsonUtilService;
import de.unikoeln.vedaweb.xmlimport.DataImportService;

@Service
public class UiDataService {
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
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
		ObjectNode response = json.newObjectNode();
		//force data import if db empty
		if (stanzaRepo.count() == 0) {
			log.warn("DB collection seems to be empty. Trying to import data from XML");
			response.put("importedXmlData", importService.importXMLData(DataImportService.LOCAL_XML_DIR, false));
		}
		//force index creation if index doesn't exist
		if (!indexService.indexExists()) {
			log.warn("Could not request UI data. Search index doesn't seem to exist.");
			log.warn("Creating and filling new index");
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
		uiData = json.newObjectNode();
		
		//load ui data template file
		try {
			uiData = json.parse(IOUtils.convertStreamToString(uiDataTemplate.getInputStream()));
		} catch (IOException e) {
			log.error("UI data template JSON could not be loaded");
			return "[ERROR] UI data template JSON could not be loaded. (UiDataService)";
		}
		
		//get grammar tags data from index and add to uiData JSONObject
		((ObjectNode) uiData.at("/search/grammar"))
			.set("tags", indexService.getUIGrammarData());
		
		//get hymn count data for every book from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/search/meta"))
			.set("scopes", indexService.getUIBooksData());
		
		//get absolute hymn count data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/search/meta"))
			.set("hymnAbs", json.getMapper().valueToTree(indexService.getHymnAbsValues()));
		
		//get addressees data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/meta"))
			.set("hymnAddressee", indexService.getStanzasMetaData("hymnAddressee"));
		
		//get group data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/meta"))
			.set("hymnGroup", indexService.getStanzasMetaData("hymnGroup"));
		
		//get strata data from index and add to uiData JSONObject
		((ObjectNode)uiData.at("/meta"))
			.set("strata", indexService.getStanzasMetaData("strata"));
		
		//load arbitrary HTML snippets
		try {
			((ObjectNode)uiData)
				.set("snippets", HtmlSnippetsLoader.loadHtmlSnippets());
		} catch (IOException e) {
			log.error("Cannot load HTML snippets: " + e.getMessage().replaceAll("\n", ""));
		}
		
		log.info("Successfully initialized frontend UI data object");
		return "[UiDataService] Successfully initialized frontend UI data object";
	}
	

}
