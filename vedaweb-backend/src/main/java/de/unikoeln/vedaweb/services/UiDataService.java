package de.unikoeln.vedaweb.services;

import java.io.IOException;

import javax.annotation.PostConstruct;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import de.unikoeln.vedaweb.util.IOUtils;

@Service
public class UiDataService {
	
	@Autowired
	private ElasticIndexService indexService;
	
	@Value("classpath:ui-data.json")
	private Resource uiDataTemplate;
	
	private JSONObject uiData;
	
	
	@PostConstruct
	public void init() {
		if (uiData == null) {
			uiData = new JSONObject();
			
			//load ui data template file
			try {
				uiData = new JSONObject(new String(IOUtils.convertStreamToByteArray(uiDataTemplate.getInputStream())));
			} catch (IOException e) {
				System.err.println("[ERROR] UI data template JSON could not be loaded. (UiDataService)");
			}
			
			//get missing data from index and add to uiData JSONObject
			((JSONObject)uiData.query("/search/grammar"))
				.put("tags", indexService.getGrammarMapping().getJSONArray("tags"));
		}
	}

	public String getUiDataJSON() {
		return uiData.toString();
	}

}
