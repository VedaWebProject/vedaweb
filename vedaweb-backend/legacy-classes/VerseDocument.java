package de.unikoeln.vedaweb.legacy;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="merged")
public class VerseDocument {
	
	@Id
	private String id;
	private String index;
	private Integer book;
	private Integer hymn;
	private Integer verse;
	
	private String translation;
	
	private List<Part> parts;
	
	public VerseDocument(){
		//...
	}
	
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
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

	public String getTranslation() {
		return translation;
	}

	public void setTranslation(String translation) {
		this.translation = translation;
	}

	public List<Part> getParts() {
		return parts;
	}

	public void setParts(List<Part> parts) {
		this.parts = parts;
	}
	
	
	@Override
	public String toString() {
		return index + "\t" + parts;
	}
	
}
