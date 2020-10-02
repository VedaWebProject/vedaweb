package de.unikoeln.vedaweb.search.grammar;

import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.SearchHit;
import de.unikoeln.vedaweb.search.SearchHits;

/**
 * POJO that represents grammar search occurrences count
 * 
 * @author bkis
 *
 */
public class GrammarSearchOccurrences {
	
	@JsonProperty("count")
	private int count;
	
	public GrammarSearchOccurrences(SearchHits hits) {
		for (SearchHit hit : hits.getHits())
			count += hit.getHighlight().size();
	}

}
