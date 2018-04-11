package de.unikoeln.vedaweb.data;

import java.util.ArrayList;
import java.util.List;

public class Pada {
	
	private int index;
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
		return index + ":" + form + " " + tokens;
	}

}
