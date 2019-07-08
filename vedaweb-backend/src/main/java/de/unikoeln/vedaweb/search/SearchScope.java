package de.unikoeln.vedaweb.search;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.annotations.ApiModelProperty;

public class SearchScope {
	
	@JsonProperty("fromBook")
	@ApiModelProperty(notes = "Scope starting from book")
	private int fromBook;
	
	@JsonProperty("fromHymn")
	@ApiModelProperty(notes = "Scope starting from hymn")
	private int fromHymn;
	
	@JsonProperty("toBook")
	@ApiModelProperty(notes = "Scope ending at book")
	private int toBook;
	
	@JsonProperty("toHymn")
	@ApiModelProperty(notes = "Scope ending at hymn")
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
