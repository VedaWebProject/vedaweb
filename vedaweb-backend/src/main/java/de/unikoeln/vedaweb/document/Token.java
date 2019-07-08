package de.unikoeln.vedaweb.document;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

public class Token {
	
	@ApiModelProperty(notes = "Index value of this token (relative to pada)")
	private int index;
	
	@ApiModelProperty(notes = "Full form of this token")
	private String form;
	
	@ApiModelProperty(notes = "Lemma of this token")
	private String lemma;
	
	@ApiModelProperty(notes = "Lemma reference IDs for the Graßmann dictionary")
	private String[] lemmaRefs;
	
	@ApiModelProperty(notes = "Grammar properties of this token")
	private LinkedHashMap<String, String> props;
	
	
	public Token(){
		props = new LinkedHashMap<String, String>();
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
	
	@JsonProperty("lemmaRefs")
	public String[] getLemmaRefs() {
		return lemmaRefs;
	}
	
	public void setLemmaRefs(String[] lemmaRefs) {
		this.lemmaRefs = lemmaRefs;
	}

	public void addLemmaRef(String lemmaRef) {
		this.lemmaRefs = Arrays.copyOf(this.lemmaRefs, this.lemmaRefs.length + 1);
		this.lemmaRefs[this.lemmaRefs.length - 1] = lemmaRef;
	}

	@JsonProperty("props")
	public Map<String, String> getProps(){
		return props;
	}
	
	public String getProp(String key) {
		return props.get(key);
	}
	
	public void addProp(String key, String value) {
		if (props.containsKey(key)){
			if (!props.get(key).contains(value)){
				props.put(key, props.get(key) + "/" + value);
			}
		} else {
			props.put(key, value);
		}
	}
	
	@Override
	public String toString() {
		return index + ":" + form + "(" + lemma + ", " + Arrays.toString(lemmaRefs) + ")" + props;
	}
}
