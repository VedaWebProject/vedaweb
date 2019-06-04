package de.unikoeln.vedaweb.util;

import de.unikoeln.vedaweb.document.Stanza;

public class LingConventions {
	
	public static String[] GLOSSINGS_ORDER = new String[]{ "case", "person", "number", "gender", "tense", "mood", "voice" };
	
	
	public static String getSourceNotation(Stanza stanza) {
		return "RV " + stanza.getBook() + "," +
				stanza.getHymn() + "," + stanza.getStanza();
	}

}
