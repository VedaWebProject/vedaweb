package de.unikoeln.vedaweb.search;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

/**
 * POJO to represent a search hit (as used by this application,
 * not by Elasticsearch)
 * 
 * @author bkis
 *
 */
public class SearchHit implements Comparable<SearchHit>{
	
	@ApiModelProperty(notes = "Score of this search result")
	private float score;

	@ApiModelProperty(notes = "ID of the represented document (stanza)")
	private String docId;
	
	@ApiModelProperty(notes = "Highlightings of this search result")
	private Map<String, String> highlight;

	@ApiModelProperty(notes = "Hymn addressee value of the represented stanza doc")
	private String hymnAddressee;
	
	@ApiModelProperty(notes = "Hymn group value of the represented stanza doc")
	private String hymnGroup;
	
	@ApiModelProperty(notes = "Strata value of the represented stanza doc")
	private String stanzaStrata;
	
	@ApiModelProperty(notes = "Internal index document source of this index document")
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
	
	public void setDocId(int book, int hymn, int stanza) {
		this.docId =
			String.format("%02d", book) + "." +
			String.format("%03d", hymn) + "." +
			String.format("%02d", stanza);
	}
	
	@JsonProperty("highlight")
	public Map<String, String> getHighlight(){
		return highlight;
	}
	
	public void addHighlight(String label, String highlight) {
		this.highlight.put(
				label,
				this.highlight.containsKey(label)
					? this.highlight.get(label) + " / " + highlight
					: highlight);
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

	@JsonProperty("stanzaStrata")
	public String getStanzaStrata() {
		return stanzaStrata;
	}

	public void setStanzaStrata(String stanzaStrata) {
		this.stanzaStrata = stanzaStrata;
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
