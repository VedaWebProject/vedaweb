package de.unikoeln.vedaweb.search.quick;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.CommonSearchData;
import io.swagger.annotations.ApiModelProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QuickSearchData extends CommonSearchData {
	
	@JsonProperty("regex")
	@ApiModelProperty(notes = "Parse RegEx? (default: false)")
	private boolean regex;
	
	@JsonProperty("input")
	@ApiModelProperty(notes = "Search input field value")
	private String input;
	
	@JsonProperty("field")
	@ApiModelProperty(notes = "Text version field to search in",
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
