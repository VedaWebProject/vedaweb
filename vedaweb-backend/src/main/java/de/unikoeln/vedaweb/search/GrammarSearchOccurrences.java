package de.unikoeln.vedaweb.search;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GrammarSearchOccurrences {
	
	@JsonProperty("count")
	private int count;
	
	public GrammarSearchOccurrences(SearchHits hits) {
		for (SearchHit hit : hits.getHits()) {
			count += hit.getHighlight().size();
		}
	}

}
