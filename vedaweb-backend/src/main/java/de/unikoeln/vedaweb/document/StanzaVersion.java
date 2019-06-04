package de.unikoeln.vedaweb.document;

import de.unikoeln.vedaweb.util.StringUtils;

public class StanzaVersion {
	
	private String id;
	private String source;
	private String language;
	private String[] form;
	private String type;
	private boolean applyKeys;

	
	public StanzaVersion(
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
	
	private StanzaVersion setId(String id) {
		this.id = id;
		return this;
	}
	
	public String getId() {
		return this.id;
	}
	
	private void generateId() {
		this.id = (type + "_" +
				StringUtils.retainLatinBaseChars(
						source.toLowerCase()
						.replaceAll("ß", "ss")
						.replaceAll("ä", "ae")
						.replaceAll("ö", "oe")
						.replaceAll("ü", "ue")
					));
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
	
	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof StanzaVersion)) return false;
		return ((StanzaVersion)obj).getId().equals(id);
	}
	
	@Override
	public int hashCode() {
		return id.hashCode();
	}
	
	public static StanzaVersion getDummy(String id) {
		return new StanzaVersion("", "", null, "", false).setId(id);
	}
	
}
