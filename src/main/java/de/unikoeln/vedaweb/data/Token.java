package de.unikoeln.vedaweb.data;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Token {
	
	private int index;
	private String form;
	private String lemma;
	private Map<String, String> grammar;
	
	
	public Token(){
		grammar = new HashMap<String, String>();
		form = "";
		lemma = "";
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
	
	public String getLemma() {
		return lemma;
	}
	
	public void setLemma(String lemma) {
		this.lemma = lemma;
	}
	
	@JsonProperty("grammar")
	public Map<String, String> getGrammarAttributes(){
		return grammar;
	}
	
	public String getGrammarAttribute(String key) {
		return grammar.get(key);
	}
	
	public void addGrammarAttribute(String key, String value) {
		if (grammar.containsKey(key)){
			if (!grammar.get(key).contains(value)){
				grammar.put(key, grammar.get(key) + "/" + value);
			}
		} else {
			grammar.put(key, value);
		}
	}
	
	@Override
	public String toString() {
		return index + ":" + form + "(" + lemma + ")" + grammar;
	}
}
