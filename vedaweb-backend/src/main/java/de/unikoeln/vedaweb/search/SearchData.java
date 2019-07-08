package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;


public class SearchData {
	
	@JsonProperty("mode")
	@ApiModelProperty(notes = "Used search mode", required = true, example = "'smart' or 'grammar'")
	private String mode;
	
	@JsonProperty("accents")
	@ApiModelProperty(notes = "Is this search accent-sensitive? (default: false)")
	private boolean accents;
	
	@JsonProperty("regex")
	@ApiModelProperty(notes = "For smart search mode: Parse RegEx (default: false)")
	private boolean regex;
	
	@JsonProperty("input")
	@ApiModelProperty(notes = "For smart search mode: Search input value")
	private String input;
	
	@JsonProperty("field")
	@ApiModelProperty(notes = "For smart search mode: Version field to search",
		example = "'version_' for all versions, 'translation_' for all translations")
	private String field;
	
	@JsonProperty("scopes")
	@ApiModelProperty(notes = "For advanced (e.g. grammar) search modes:"
			+ "List of search scopes to limit search to")
	private List<SearchScope> scopes;
	
	@JsonProperty("meta")
	@ApiModelProperty(notes = "For advanced (e.g. grammar) search modes:"
			+ "List of meta properties to filter for")
	private Map<String, String[]> meta;
	
	@JsonProperty("blocks")
	@ApiModelProperty(notes = "For grammar search: List of search blocks")
	private List<Map<String, Object>> blocks;
	
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
	
	
	public SearchData(){
		blocks = new ArrayList<Map<String, Object>>();
		sortBy = "_score";
		sortOrder = "descend";
	}
	
	
	public String getMode() {
		return mode;
	}

	
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	
	public boolean isAccents() {
		return accents;
	}


	public void setAccents(boolean accents) {
		this.accents = accents;
	}
	
	
	public boolean isRegex() {
		return regex;
	}


	public void setRegex(boolean regex) {
		this.regex = regex;
	}


	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input.trim();
	}
	
	
	public String getField() {
		return field;
	}


	public void setField(String field) {
		this.field = field;
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


	public List<Map<String, Object>> getBlocks() {
		return blocks;
	}


	public void setBlocks(List<Map<String, Object>> blocks) {
		this.blocks = blocks;
	}


	public void addBlock(Map<String, Object> block) {
		this.blocks.add(block);
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


	@Override
	public String toString() {
		return "mode:" + mode + (input != null ? " input:" + input : "");
	}
	
}
