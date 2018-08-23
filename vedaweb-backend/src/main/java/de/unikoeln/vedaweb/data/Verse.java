package de.unikoeln.vedaweb.data;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="verses")
public class Verse {
	
	@Id
	private String id;
	private int index;
	
	private int book;
	private int hymn;
	private int verse;
	
	private List<Translation> translations;
	private List<Pada> padas;
	
	
	
	public Verse(){
		translations = new ArrayList<Translation>();
		padas = new ArrayList<Pada>();
	}
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public int getBook() {
		return book;
	}

	public void setBook(int book) {
		this.book = book;
	}

	public int getHymn() {
		return hymn;
	}

	public void setHymn(int hymn) {
		this.hymn = hymn;
	}

	public int getVerse() {
		return verse;
	}

	public void setVerse(int verse) {
		this.verse = verse;
	}

	public List<Translation> getTranslations() {
		return translations;
	}

	public void addTranslation(Translation translation) {
		translations.add(translation);
	}

	public List<Pada> getPadas() {
		return padas;
	}

	public void addPada(Pada pada) {
		padas.add(pada);
	}
	
	@Override
	public String toString() {
		return index + ":" + id + ":" + book + "." + hymn + "." + verse + "\t" +
				padas + "\t" +
				translations;
	}

}
