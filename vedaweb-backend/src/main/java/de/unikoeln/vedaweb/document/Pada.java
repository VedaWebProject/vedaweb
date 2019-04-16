package de.unikoeln.vedaweb.document;

import java.util.ArrayList;
import java.util.List;

public class Pada {
	
	private String id;
	private String label;
	private int index;
	private List<Token> grammarData;
	
	
	public Pada() {
		grammarData = new ArrayList<Token>();
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public List<Token> getGrammarData() {
		return grammarData;
	}
	
	public void setGrammarData(List<Token> grammarData) {
		this.grammarData = grammarData;
	}

	public void addGrammarData(Token token) {
		grammarData.add(token);
	}

}
