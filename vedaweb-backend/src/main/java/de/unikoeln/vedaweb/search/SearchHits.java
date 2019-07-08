package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

public class SearchHits {
	
	@JsonProperty("hits")
	@ApiModelProperty(notes = "List of search results")
	private List<SearchHit> hits;
	
	@JsonProperty("total")
	@ApiModelProperty(notes = "Total number of search results")
	private long total;
	
	@JsonProperty("took")
	@ApiModelProperty(notes = "Runtime of this search in milliseconds")
	private long took;
	
	@JsonProperty("maxScore")
	@ApiModelProperty(notes = "Maximum score withing these search results")
	private float maxScore;
	
	
	public SearchHits() {
		this.hits = new ArrayList<SearchHit>();
	}
	
	public long getTotal() {
		return total;
	}

	public void setTotal(long total) {
		this.total = total;
	}

	public long getTook() {
		return took;
	}

	public void setTook(long took) {
		this.took = took;
	}
	
	public float getMaxScore() {
		return maxScore;
	}

	public void setMaxScore(float maxScore) {
		this.maxScore = maxScore;
	}

	public List<SearchHit> getHits(){
		return this.hits;
	}
	
	public void addHit(SearchHit hit) {
		this.hits.add(hit);
	}

}
