package de.unikoeln.vedaweb.search;
import java.util.ArrayList;
import java.util.List;

public class SearchRequest {
	
	private int scopeBook;
	private int scopeHymn;
	
	private List<TargetToken> targets;

	
	public SearchRequest(int scopeBook, int scopeHymn){
		targets = new ArrayList<TargetToken>();
		this.scopeBook = scopeBook;
		this.scopeHymn = scopeHymn;
	}
	

	public List<TargetToken> getTargetTokens() {
		return targets;
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


	public List<TargetToken> getTargets() {
		return targets;
	}


	public void setTargets(List<TargetToken> targets) {
		this.targets = targets;
	}


	public void addTargetToken(TargetToken targetToken) {
		if (scopeBook > -1)  targetToken.addAttribute("book", scopeBook);
		if (scopeHymn > -1)  targetToken.addAttribute("hymn", scopeHymn);
		this.targets.add(targetToken);
	}
	
	@Override
	public String toString() {
		return "book:" + scopeBook + " hymn:" + scopeHymn + " targets:?";
	}
	
}
