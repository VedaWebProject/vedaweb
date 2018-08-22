package de.unikoeln.vedaweb.data;

public class Translation {
	
	private String language;
	private String translation;
	private String source;
	
	
	public Translation(String language, String translation, String source) {
		super();
		this.language = language;
		this.translation = translation;
		this.source = source;
	}
	
	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	
	public String getTranslation() {
		return translation;
	}
	
	public void setTranslation(String translation) {
		this.translation = translation;
	}
	
	public String getSource() {
		return source;
	}
	
	public void setSource(String source) {
		this.source = source;
	}
	
	@Override
	public String toString() {
		return source + "(" + language + "): " + translation;
	}
	
}
