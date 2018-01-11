package de.unikoeln.vedaweb.data;

import java.util.List;

public class Part {
	
	private Integer index;
	private String form;
	private List<Token> tokens;
	
	public Part(){
		//...
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
	}

	public List<Token> getTokens() {
		return tokens;
	}

	public void setTokens(List<Token> tokens) {
		this.tokens = tokens;
	}
	
}
