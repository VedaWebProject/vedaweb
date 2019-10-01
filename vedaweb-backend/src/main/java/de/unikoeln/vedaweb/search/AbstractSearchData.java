package de.unikoeln.vedaweb.search;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

public abstract class AbstractSearchData {
	
	@JsonProperty("accents")
	@ApiModelProperty(notes = "Is this search accent-sensitive? (default: false)")
	private boolean accents;
	
	@JsonProperty("from")
	@ApiModelProperty(notes = "Search result pagination: Offset of results window")
	private int from;
	
	@JsonProperty("size")
	@ApiModelProperty(notes = "Search result pagination: Size of results window")
	private int size;
	
	@JsonProperty("sortBy")
	@ApiModelProperty(notes = "Search result sorting: Property to sort by",
		example = "'_doc' for location, '_score' for relevance, 'hymnAddressee', 'hymnGroup', 'strata'")
	private String sortBy;
	
	@JsonProperty("sortOrder")
	@ApiModelProperty(notes = "Search result sorting", example = "'ascend' or 'descend'")
	private String sortOrder;
	
	@JsonProperty("scopes")
	@ApiModelProperty(notes = "List of search scopes to limit search to")
	private List<SearchScope> scopes;
	
	@JsonProperty("meta")
	@ApiModelProperty(notes = "List of meta properties to filter for")
	private Map<String, String[]> meta;
	
	
	public AbstractSearchData(){
		sortBy = "_score";
		sortOrder = "descend";
	}
	
	public boolean isAccents() {
		return accents;
	}


	public void setAccents(boolean accents) {
		this.accents = accents;
	}
	
	public int getFrom() {
		return from;
	}


	public void setFrom(int from) {
		this.from = from;
	}
	

	public int getSize() {
		return size;
	}


	public void setSize(int size) {
		this.size = size;
	}
	
	
	public String getSortBy() {
		return sortBy;
	}


	public void setSortBy(String sortBy) {
		this.sortBy = sortBy;
	}
	
	
	public String getSortOrder() {
		return sortOrder;
	}


	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	}
	
	
	public List<SearchScope> getScopes() {
		return scopes;
	}


	public void setScopes(List<SearchScope> scopes) {
		this.scopes = scopes;
	}
	

	public Map<String, String[]> getMeta() {
		return meta;
	}


	public void setMeta(Map<String, String[]> meta) {
		this.meta = meta;
	}

}
