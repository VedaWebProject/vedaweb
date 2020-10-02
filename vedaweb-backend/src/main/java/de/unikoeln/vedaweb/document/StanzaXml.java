package de.unikoeln.vedaweb.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * POJO to represent the XML source of a stanza document
 * 
 * @author bkis
 *
 */
@Document(collection="stanzasXml")
public class StanzaXml implements Comparable<StanzaXml> {
	
	@Id
	private String id;
	private String xml;
	
	
	public StanzaXml(String id, String xml) {
		super();
		this.id = id;
		this.xml = xml;
	}
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public String getXml() {
		return xml;
	}

	public void setXml(String xml) {
		this.xml = xml;
	}

	@Override
	public String toString() {
		return xml;
	}

	@Override
	public int compareTo(StanzaXml o) {
		return id.compareTo(o.getId());
	}
	
}
