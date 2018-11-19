package de.unikoeln.vedaweb.search;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchHit implements Comparable<SearchHit>{
	
	private float score;
	private String docId;
	private Map<String, String> highlight;
	private String hymnAddressee;
	private String hymnGroup;
	private String verseStrata;
	private Map<String, Object> source;
	
	public SearchHit() {
		this.highlight = new HashMap<String, String>();
	}
	
	@JsonProperty("score")
	public float getScore() {
		return score;
	}
	
	public void setScore(float score) {
		this.score = score;
	}
	
	@JsonProperty("docId")
	public String getDocId() {
		return docId;
	}
	
	public void setDocId(int book, int hymn, int verse) {
		this.docId =
			String.format("%02d", book) + "." +
			String.format("%03d", hymn) + "." +
			String.format("%02d", verse);
	}
	
	@JsonProperty("highlight")
	public Map<String, String> getHighlight(){
		return highlight;
	}
	
	public void addHighlight(String label, String highlight) {
		this.highlight.put(label, highlight);
	}
	
	@JsonProperty("hymnAddressee")
	public String getHymnAddressee() {
		return hymnAddressee;
	}

	public void setHymnAddressee(String hymnAddressee) {
		this.hymnAddressee = hymnAddressee;
	}
	
	@JsonProperty("hymnGroup")
	public String getHymnGroup() {
		return hymnGroup;
	}

	public void setHymnGroup(String hymnGroup) {
		this.hymnGroup = hymnGroup;
	}

	@JsonProperty("verseStrata")
	public String getVerseStrata() {
		return verseStrata;
	}

	public void setVerseStrata(String verseStrata) {
		this.verseStrata = verseStrata;
	}
	
	@JsonProperty("source")
	public Map<String, Object> getSource() {
		return source;
	}

	public void setSource(Map<String, Object> source) {
		this.source = source;
	}

	@Override
	public int compareTo(SearchHit o) {
		return (int) (o.getScore() - score);
	}
	
	@Override
	public boolean equals(Object obj) {
		return obj != null
			&& obj instanceof SearchHit
			&& ((SearchHit)obj).getDocId().equals(docId);
	}
	
	@Override
	public int hashCode() {
		return docId.hashCode();
	}
	
	@Override
	public String toString() {
		return docId + "\t(" + score + ")";
	}
	
}
