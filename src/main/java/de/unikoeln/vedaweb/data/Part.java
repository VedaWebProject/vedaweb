package de.unikoeln.vedaweb.data;

import java.util.List;
import java.util.Map;

public class Part {
	
	private Integer index;
	private String form;
	private List<Map<String, Object>> tokens;
	
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

	public List<Map<String, Object>> getTokens() {
		return tokens;
	}

	public void setTokens(List<Map<String, Object>> tokens) {
		this.tokens = tokens;
	}
	
}
