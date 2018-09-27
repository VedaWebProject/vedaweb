package de.unikoeln.vedaweb.data;

import java.util.ArrayList;
import java.util.List;

public class Pada {
	
	private int index;
	private char line;
	private String label;
	private String form;
	private List<Token> tokens;
	
	
	public Pada(){
		tokens = new ArrayList<Token>();
		form = "";
	}
	
	public int getIndex(){
		return index;
	}
	
	public void setIndex(int index){
		this.index = index;
	}
	
	public char getLine() {
		return line;
	}

	public void setLine(char line) {
		this.line = line;
	}
	
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
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
	
	public void addToken(Token token) {
		tokens.add(token);
	}
	
	@Override
	public String toString() {
		return index + ":(" + line + ")" + form + " " + tokens;
	}

}
