package de.unikoeln.vedaweb.search.metrical;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.CommonSearchData;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * POJO that represents the data of a metrical pattern search request
 * 
 * @author bkis
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class MetricalSearchData extends CommonSearchData {
	
	@JsonProperty("input")
	@Schema(description = "Search input field value")
	private String input;
	
	@JsonProperty("field")
	@Schema(description = "Text version field to search in",
		example = "'version_' for all versions, 'translation_' for all translations")
	private String field;


	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input.trim();
	}
	
	
	public String getField() {
		return field;
	}


	public void setField(String field) {
		this.field = field;
	}


	@Override
	public String toString() {
		return "Metrical Search:" + (input != null ? " input:" + input : "");
	}
	
}
