package de.unikoeln.vedaweb.search;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchScope {
	
	@JsonProperty("fromBook") public int fromBook;
	@JsonProperty("fromHymn") public int fromHymn;
	@JsonProperty("toBook") public int toBook;
	@JsonProperty("toHymn") public int toHymn;
	
}
