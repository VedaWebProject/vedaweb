package de.unikoeln.vedaweb.dictcorrection;

import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection="dictCorrections")
public class Correction {
	
	private String caseId;
	private String lemma;
	private String dictId;
	private String headwordIso;
	private String comment;
	
	public String getLemma() {
		return lemma;
	}
	
	public void setLemma(String lemma) {
		this.lemma = lemma;
	}
	
	public String getDictId() {
		return dictId;
	}
	
	public void setDictId(String dictId) {
		this.dictId = dictId;
	}
	
	public String getCaseId() {
		return caseId;
	}
	
	public void setCaseId(String caseId) {
		this.caseId = caseId;
	}
	
	public String getHeadwordIso() {
		return headwordIso;
	}
	
	public void setHeadwordIso(String headwordIso) {
		this.headwordIso = headwordIso;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
}
