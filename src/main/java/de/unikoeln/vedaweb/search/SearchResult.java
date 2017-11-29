package de.unikoeln.vedaweb.search;
import java.util.Map;

import org.apache.lucene.document.Document;

public class SearchResult implements Comparable<SearchResult>{
	
	private float score;
	private String locationId;
	private Map<String, Object> searchBlock;
	private Document doc;
	
	
	public SearchResult(float score, String locationId, Map<String, Object> searchBlock, Document doc) {
		super();
		this.score = score;
		this.locationId = locationId;
		this.searchBlock = searchBlock;
		this.doc = doc;
	}

	public float getScore() {
		return score;
	}

	public String getLocationId() {
		return locationId;
	}

	public Map<String, Object> getSearchBlock() {
		return searchBlock;
	}

	@Override
	public int compareTo(SearchResult o) {
		return (int) (o.getScore() - score);
	}
	
	@Override
	public boolean equals(Object obj) {
		return obj != null
			&& obj instanceof SearchResult
			&& ((SearchResult)obj).getLocationId().equals(locationId);
	}
	
	@Override
	public int hashCode() {
		return locationId.hashCode();
	}
	
	@Override
	public String toString() {
		return score + "\t" + locationId + "\t" + searchBlock + "\t" + doc;
	}
	
}
