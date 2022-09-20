package de.unikoeln.vedaweb.document;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Pada POJO
 * 
 * @author bkis
 *
 */
public class Pada {
	
	@Schema(description = "ID of this pada")
	private String id;
	
	@Schema(description = "Pada label prop")
	private String label;
	
	@Schema(description = "Index value of this pada (relative to stanza)")
	private int index;
	
	@Schema(description = "List of tokens of this pada")
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
	
	public void sortGrammarData() {
		Collections.sort(grammarData, new Comparator<Token>() {
			@Override
			public int compare(Token o1, Token o2) {
				return o1.getIndex() - o2.getIndex();
			}
		});
	}

}
