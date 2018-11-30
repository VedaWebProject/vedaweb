package de.unikoeln.vedaweb.data;

public class VerseVersion {
	
	private String id;
	private String source;
	private String language;
	private String[] form;
	private String type;
	private boolean applyKeys;
	
	public VerseVersion(
			String source,
			String language,
			String[] form,
			String type,
			boolean applyKeys) {
		super();
		this.source = source;
		this.language = language;
		this.form = form;
		this.type = type;
		this.applyKeys = applyKeys;
		generateId();
	}
	
	public String getId() {
		return this.id;
	}
	
	public void generateId() {
		this.id = (type + "_" + source.replaceAll("\\P{L}", "")).toLowerCase();
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
	
	public boolean isApplyKeys() {
		return applyKeys;
	}

	public void setApplyKeys(boolean applyKeys) {
		this.applyKeys = applyKeys;
	}

	@Override
	public String toString() {
		return source + " (" + language + ")";
	}
	
}
