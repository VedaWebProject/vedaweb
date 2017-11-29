package de.unikoeln.vedaweb.search;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchRequest {
	
	private int scopeBook;
	private int scopeHymn;
	
	private List<Map<String, Object>> blocks;

	
	public SearchRequest(){}
	
	
	public SearchRequest(int scopeBook, int scopeHymn){
		blocks = new ArrayList<Map<String, Object>>();
		this.scopeBook = scopeBook;
		this.scopeHymn = scopeHymn;
	}
	

	public List<Map<String, Object>> getBlocks() {
		return blocks;
	}
	
	
	public int getScopeBook() {
		return scopeBook;
	}

	@JsonProperty("book")
	public void setScopeBook(int scopeBook) {
		this.scopeBook = scopeBook;
	}


	public int getScopeHymn() {
		return scopeHymn;
	}

	@JsonProperty("hymn")
	public void setScopeHymn(int scopeHymn) {
		this.scopeHymn = scopeHymn;
	}

	@JsonProperty("blocks")
	public void setBlocks(List<Map<String, Object>> blocks) {
		this.blocks = blocks;
	}


	public void addBlock(Map<String, Object> block) {
		this.blocks.add(block);
	}
	
	@Override
	public String toString() {
		return "book:" + scopeBook + " hymn:" + scopeHymn + " blocks:" + blocks;
	}
	
	public void cleanAndFormatFields(){
		for (Map<String, Object> block : blocks){
			block.values().removeAll(Collections.singleton(""));
			for (String field : block.keySet()){
				if (block.get(field) instanceof String
						&& ((String)block.get(field)).matches("\\d+")){
					block.put(field, Integer.parseInt(((String)block.get(field))));
				}
			}
		}
	}
	
}
