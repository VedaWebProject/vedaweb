package de.unikoeln.vedaweb.search.quick;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.CommonSearchData;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * POJO that represents the data of a quick search request
 * 
 * @author bkis
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuickSearchData extends CommonSearchData {
	
	@JsonProperty("regex")
	@Schema(description = "Parse RegEx? (default: false)")
	private boolean regex;
	
	@JsonProperty("input")
	@Schema(description = "Search input field value")
	private String input;
	
	@JsonProperty("field")
	@Schema(description = "Text version field to search in",
		example = "'version_' for all versions, 'translation_' for all translations")
	private String field;
	
	
	public boolean isRegex() {
		return regex;
	}


	public void setRegex(boolean regex) {
		this.regex = regex;
	}


	public String getInput() {
		return input;
	}


	public QuickSearchData setInput(String input) {
		this.input = input.trim();
		return this;
	}
	
	
	public String getField() {
		return field;
	}


	public QuickSearchData setField(String field) {
		this.field = field;
		return this;
	}


	@Override
	public String toString() {
		return "QuickSearch:" + (input != null ? " input:" + input : "");
	}
	
}
