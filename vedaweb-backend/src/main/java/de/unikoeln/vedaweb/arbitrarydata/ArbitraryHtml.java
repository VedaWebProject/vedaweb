package de.unikoeln.vedaweb.arbitrarydata;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="arbitrary")
public class ArbitraryHtml {
	
	@Id
	private String id;
	private String html;
	
	public ArbitraryHtml(String id, String html) {
		this.id = id;
		this.html = html;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getHtml() {
		return html;
	}
	
	public void setHtml(String html) {
		this.html = html;
	}

}
