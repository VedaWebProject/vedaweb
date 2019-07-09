package de.unikoeln.vedaweb.export;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

public class ExportLayers {
	@ApiModelProperty(
		notes = "List of data layer objects to include into export",
		required = true,
		example = "[{\"id\":\"translation_geldner\",\"label\":\"Geldner (DE)\"}, {\"id\":\"...\",\"label\":\"...\"}]")
	@JsonProperty("layers")
	List<ExportLayer> layers;
	
	public static class ExportLayer {
		@ApiModelProperty(notes = "ID of this layer", required = true)
		@JsonProperty("id")
		String id;
		@ApiModelProperty(notes = "Label string of this layer", required = true)
		@JsonProperty("label")
		String label;
	}
}
