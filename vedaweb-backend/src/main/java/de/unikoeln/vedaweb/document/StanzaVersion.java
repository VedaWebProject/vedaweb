package de.unikoeln.vedaweb.document;

import de.unikoeln.vedaweb.util.StringUtils;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * POJO representing stanza text versions and translations
 * 
 * @author bkis
 *
 */
public class StanzaVersion {
	
	@Schema(description = "ID of this stanza version")
	private String id;
	
	@Schema(description = "Source (author)")
	private String source;
	
	@Schema(description = "Language / transliteration standard")
	private String language;
	
	@Schema(description = "The lines of this stanza version")
	private String[] form;
	
	@Schema(description = "The metrical data of the lines of this stanza version")
	private String[] metricalData;
	
	@Schema(description = "Type of this version ('version' or 'translation')")
	private String type;
	
	@Schema(description = "True if this version has one pada per line")
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

	public String[] getMetricalData() {
		return metricalData;
	}

	public void setMetricalData(String[] metricalData) {
		this.metricalData = metricalData;
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
