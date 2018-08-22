package de.unikoeln.vedaweb.search;
import java.util.Map;

import org.elasticsearch.common.document.DocumentField;


public class SearchResult implements Comparable<SearchResult>{
	
	private float score;
	private String locationId;
	private Map<String,DocumentField> fields;
	
	
	public SearchResult(float score, String locationId, Map<String,DocumentField> fields) {
		super();
		this.score = score;
		this.locationId = locationId;
		this.fields = fields;
	}

	public float getScore() {
		return score;
	}

	public String getLocationId() {
		return locationId;
	}
	
	public Map<String,DocumentField> getFields(){
		return fields;
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
		return score + "\t" + locationId + "\t" + fields;
	}
	
}
