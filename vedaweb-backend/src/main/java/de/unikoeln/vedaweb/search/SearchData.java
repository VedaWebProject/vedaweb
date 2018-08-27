package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;


public class SearchData {
	
	@JsonProperty("mode")
	private String mode;
	
	@JsonProperty("input")
	private String input;
	
	@JsonProperty("field")
	private String field;
	
	@JsonProperty("scopes")
	private List<SearchScope> scopes;
	
	@JsonProperty("blocks")
	private List<Map<String, Object>> blocks;
	
	@JsonProperty("from")
	private int from;

	
	public SearchData(){
		blocks = new ArrayList<Map<String, Object>>();
	}
	
	
	public String getMode() {
		return mode;
	}

	
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	
	public String getInput() {
		return input;
	}


	public void setInput(String input) {
		this.input = input;
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


	@Override
	public String toString() {
		return "mode:" + mode + (input != null ? " input:" + input : "");
	}
	
	public void cleanAndFormatFields(){
		//clean search blocks
		for (Map<String, Object> block : blocks){
			block.values().removeAll(Collections.singleton(""));
			for (String field : block.keySet()){
				if (block.get(field) instanceof String
						&& ((String)block.get(field)).matches("-?\\d+")){
					block.put(field, Integer.parseInt(((String)block.get(field))));
				}
			}
		}
		
		//clean search scopes
		if (scopes == null) return;
		for (SearchScope scope : scopes){
			scope.fromBook = scope.fromBook > 0 ? scope.fromBook : -1;
			scope.fromHymn = scope.fromHymn > 0 ? scope.fromHymn : -1;
			scope.toBook = scope.toBook > 0 ? scope.toBook : -1;
			scope.toHymn = scope.toHymn > 0 ? scope.toHymn : -1;
		}
		
	}
	
}
