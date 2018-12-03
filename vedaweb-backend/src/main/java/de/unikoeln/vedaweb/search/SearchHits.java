package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchHits {
	
	@JsonProperty("hits")
	private List<SearchHit> hits;
	
	@JsonProperty("total")
	private long total;
	
	@JsonProperty("took")
	private long took;
	
	
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
	
	public List<SearchHit> getHits(){
		return this.hits;
	}
	
	public void addHit(SearchHit hit) {
		this.hits.add(hit);
	}

}
