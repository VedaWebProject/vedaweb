package de.unikoeln.vedaweb.search.metricalposition;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.CommonSearchData;
import io.swagger.annotations.ApiModelProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MetricalPositionSearchData extends CommonSearchData {
	
	@JsonProperty("input")
	@ApiModelProperty(notes = "Search input field value")
	private String input;
	

	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input.trim();
	}
	

	@Override
	public String toString() {
		return "Metrical Position Search:" + (input != null ? " input:" + input : "");
	}
	
}
