package de.unikoeln.vedaweb.search;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;


public class SearchDataAdvanced {
	
	private int book;
	private int hymn;
	
	@JsonProperty("blocks")
	private List<Map<String, Object>> blocks;

	
	public SearchDataAdvanced(){
		blocks = new ArrayList<Map<String, Object>>();
		this.book = -1;
		this.hymn = -1;
	}
	
	
	public List<Map<String, Object>> getBlocks() {
		return blocks;
	}
	
	
	public int getScopeBook() {
		return book;
	}

	public void setBook(int book) {
		this.book = book;
	}

	public int getScopeHymn() {
		return hymn;
	}

	public void setHymn(int hymn) {
		this.hymn = hymn;
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
		return "book:" + book + " hymn:" + hymn + " blocks:" + blocks;
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
		//clean search scope
		book = book > 0 ? book : -1;
		hymn = hymn > 0 ? hymn : -1;
	}
	
}
