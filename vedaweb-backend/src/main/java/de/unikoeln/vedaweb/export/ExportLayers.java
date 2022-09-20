package de.unikoeln.vedaweb.export;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Superfluous, really.
 * 
 * @author bkis
 *
 */
public class ExportLayers {
	@Schema(
		description = "List of data layer objects to include into export",
		required = true,
		example = "[{\"id\":\"translation_geldner\",\"label\":\"Geldner "
				+ "(DE)\"}, {\"id\":\"...\",\"label\":\"...\"}]")
	@JsonProperty("layers")
	List<ExportLayer> layers;
	
	public static class ExportLayer {
		@Schema(description = "ID of this layer", required = true)
		@JsonProperty("id")
		String id;
		@Schema(description = "Label string of this layer", required = true)
		@JsonProperty("label")
		String label;
	}
}
