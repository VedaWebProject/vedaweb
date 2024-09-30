package de.unikoeln.vedaweb.search;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;


/**
 * Abstract POJO to hold common search request data
 * (is extended in specific search request data classes)
 * 
 * @author bkis
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public abstract class CommonSearchData {
	
	@JsonProperty("accents")
	@Schema(description = "Is this search accent-sensitive? (default: false)")
	private boolean accents;
	
	@JsonProperty("from")
	@Schema(description = "Search result pagination: Offset of results window")
	private int from;
	
	@JsonProperty("size")
	@Schema(description = "Search result pagination: Size of results window")
	private int size;
	
	@JsonProperty("sortBy")
	@Schema(description = "Search result sorting: Property to sort by",
		example = "'_doc' for location, '_score' for relevance, 'hymnAddressee', 'hymnGroup', 'strata'")
	private String sortBy;
	
	@JsonProperty("sortOrder")
	@Schema(description = "Search result sorting", example = "'ascend' or 'descend'")
	private String sortOrder;
	
	@JsonProperty("scopes")
	@Schema(description = "List of search scopes to limit search to")
	private List<SearchScope> scopes;
	
	@JsonProperty("meta")
	@Schema(description = "List of meta properties to filter for")
	private Map<String, String[]> meta;
	
	public CommonSearchData(){
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
	
	
	public String getIndexName() {
		return IndexService.indexName;
	}

}
