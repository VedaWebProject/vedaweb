package de.unikoeln.vedaweb.feedback;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="feedback")
public class Feedback {
	
	private String senderName;
	private String message;
	private String date;
	
	public Feedback(String senderName, String message) {
		super();
		this.senderName = senderName;
		this.message = message;
		this.date = new Date().toString();
	}

	public String getSenderName() {
		return senderName;
	}

	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
	
	

}
