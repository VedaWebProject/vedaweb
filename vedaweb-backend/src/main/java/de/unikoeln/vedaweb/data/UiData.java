package de.unikoeln.vedaweb.data;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="uiData")
public class UiData {
	
	@Id
	private String id;
	private Map<String, Object> data;

}
