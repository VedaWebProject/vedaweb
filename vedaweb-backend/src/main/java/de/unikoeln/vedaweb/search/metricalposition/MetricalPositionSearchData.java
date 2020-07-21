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
	
	@JsonProperty("position")
	@ApiModelProperty(notes = "Metrical position field value")
	private String position;


	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input.trim();
	}
	

	public String getPosition() {
		return position;
	}


	public void setPosition(String position) {
		this.position = position;
	}


	@Override
	public String toString() {
		return "Metrical Position Search:" + (input != null ? " input:" + input : "");
	}
	
}
