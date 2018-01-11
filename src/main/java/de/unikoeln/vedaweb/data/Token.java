package de.unikoeln.vedaweb.data;

public class Token {
	
	private Integer index;
	private String form;
	private String lemma;
	
	private String genus;
	private String casus;
	private String numerus;
	private String person;
	private String tempus;
	private String modus;
	private String diathesis;
	
	private String lexicon;
	
	public Token(){
		//...
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
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

	public String getGenus() {
		return genus;
	}

	public void setGenus(String genus) {
		this.genus = genus;
	}

	public String getCasus() {
		return casus;
	}

	public void setCasus(String casus) {
		this.casus = casus;
	}

	public String getNumerus() {
		return numerus;
	}

	public void setNumerus(String numerus) {
		this.numerus = numerus;
	}

	public String getPerson() {
		return person;
	}

	public void setPerson(String person) {
		this.person = person;
	}

	public String getTempus() {
		return tempus;
	}

	public void setTempus(String tempus) {
		this.tempus = tempus;
	}

	public String getModus() {
		return modus;
	}

	public void setModus(String modus) {
		this.modus = modus;
	}

	public String getDiathesis() {
		return diathesis;
	}

	public void setDiathesis(String diathesis) {
		this.diathesis = diathesis;
	}

	public String getLexicon() {
		return lexicon;
	}

	public void setLexicon(String lexicon) {
		this.lexicon = lexicon;
	}
	
}
