package de.unikoeln.vedaweb.search;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SearchRequest {
	
	private int scopeBook;
	private int scopeHymn;
	
	private List<Map<String, Object>> blocks;

	
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


	public void setScopeBook(int scopeBook) {
		this.scopeBook = scopeBook;
	}


	public int getScopeHymn() {
		return scopeHymn;
	}


	public void setScopeHymn(int scopeHymn) {
		this.scopeHymn = scopeHymn;
	}


	public void setBlocks(List<Map<String, Object>> blocks) {
		this.blocks = blocks;
	}


	public void addBlock(Map<String, Object> block) {
		this.blocks.add(block);
	}
	
	@Override
	public String toString() {
		return "book:" + scopeBook + " hymn:" + scopeHymn + " targets:?";
	}
	
}
