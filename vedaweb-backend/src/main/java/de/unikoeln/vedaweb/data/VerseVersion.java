package de.unikoeln.vedaweb.data;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VerseVersion {
	
	private String source;
	private String language;
	private String[] form;
	private String type;
	
	public VerseVersion(
			String source,
			String language,
			String[] form,
			String type) {
		super();
		this.source = source;
		this.language = language;
		this.form = form;
		this.type = type;
	}
	
	@JsonProperty("id")
	public String getId() {
		return (type + "_" + source.replaceAll("\\P{L}", "")).toLowerCase();
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String[] getForm() {
		return form;
	}

	public void setForm(String[] form) {
		this.form = form;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return source + " (" + language + ")";
	}
	
}
