package de.unikoeln.vedaweb.search.grammar;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;

import de.unikoeln.vedaweb.search.AbstractSearchData;
import io.swagger.annotations.ApiModelProperty;


public class GrammarSearchData extends AbstractSearchData {
	
	@JsonProperty("blocks")
	@ApiModelProperty(notes = "List of search blocks")
	private List<Map<String, Object>> blocks;
	
	
	public GrammarSearchData(){
		blocks = new ArrayList<Map<String, Object>>();
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
	

	@Override
	public String toString() {
		return "GrammarSearch:" + blocks;
	}
	
}
