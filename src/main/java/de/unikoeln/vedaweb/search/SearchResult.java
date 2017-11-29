package de.unikoeln.vedaweb.search;
import org.apache.lucene.document.Document;

public class SearchResult implements Comparable<SearchResult>{
	
	private float score;
	private String locationId;
	private TargetToken targetToken;
	private Document doc;
	
	
	public SearchResult(float score, String locationId, TargetToken targetToken, Document doc) {
		super();
		this.score = score;
		this.locationId = locationId;
		this.targetToken = targetToken;
		this.doc = doc;
	}

	public float getScore() {
		return score;
	}

	public String getLocationId() {
		return locationId;
	}

	public TargetToken getTargetToken() {
		return targetToken;
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
		return score + "\t" + locationId + "\t" + targetToken + "\t" + doc;
	}
	
}
