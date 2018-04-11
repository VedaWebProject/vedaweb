package de.unikoeln.vedaweb.search;
import de.unikoeln.vedaweb.data.Verse;


public class SearchResult implements Comparable<SearchResult>{
	
	private float score;
	private String locationId;
	private Verse doc;
	
	
	public SearchResult(float score, String locationId, Verse doc) {
		super();
		this.score = score;
		this.locationId = locationId;
		this.doc = doc;
	}

	public float getScore() {
		return score;
	}

	public String getLocationId() {
		return locationId;
	}
	
	public Verse getDoc(){
		return doc;
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
		return score + "\t" + locationId + "\t" + doc;
	}
	
}
