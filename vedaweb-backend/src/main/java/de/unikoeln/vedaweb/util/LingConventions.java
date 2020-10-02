package de.unikoeln.vedaweb.util;

import de.unikoeln.vedaweb.document.Stanza;

/**
 * Utility class to hold definitions for some linguistic conventions
 * 
 * @author bkis
 *
 */
public class LingConventions {
	
	// order of glossings attributes
	public static String[] GLOSSINGS_ORDER = new String[]{ 
			"case", "person", "number", "gender", "tense", "mood", "voice" };
	
	// source notation of a stanza
	public static String getSourceNotation(Stanza stanza) {
		return "RV " + stanza.getBook() + "," +
				stanza.getHymn() + "," + stanza.getStanza();
	}

}
