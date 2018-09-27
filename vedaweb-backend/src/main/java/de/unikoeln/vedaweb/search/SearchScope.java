package de.unikoeln.vedaweb.search;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SearchScope {
	
	@JsonProperty("fromBook")
	private int fromBook;
	
	@JsonProperty("fromHymn")
	private int fromHymn;
	
	@JsonProperty("toBook")
	private int toBook;
	
	@JsonProperty("toHymn")
	private int toHymn;
	
	
	public int getFromBook() {
		return fromBook;
	}


	public void setFromBook(int fromBook) {
		this.fromBook = fromBook;
	}


	public int getFromHymn() {
		return fromHymn;
	}


	public void setFromHymn(int fromHymn) {
		this.fromHymn = fromHymn;
	}


	public int getToBook() {
		return toBook;
	}


	public void setToBook(int toBook) {
		this.toBook = toBook;
	}


	public int getToHymn() {
		return toHymn;
	}


	public void setToHymn(int toHymn) {
		this.toHymn = toHymn;
	}


	public boolean isEmpty() {
		return fromBook == 0
			&& fromHymn == 0
			&& toBook == 0
			&& toHymn == 0;
	}
	
	@Override
	public String toString() {
		return fromBook + "." + fromHymn + "-" + toBook + "." + toHymn;
	}
	
}
