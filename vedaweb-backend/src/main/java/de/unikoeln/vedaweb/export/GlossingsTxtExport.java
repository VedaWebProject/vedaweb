package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.Token;
import de.unikoeln.vedaweb.util.LingConventions;

public class GlossingsTxtExport {
	
	
	public static String glossingsTxt(Stanza stanza) {
		return glossingsTxtNoMeta(stanza) + "\n\n(" + 
				LingConventions.getSourceNotation(stanza) + ")";
	}
	
	
	public static String glossingsTxtNoMeta(Stanza stanza) {
		StringBuilder sb = new StringBuilder();
		char padaIndex = 'a';
		
		for (Pada p : stanza.getPadas()) {
			//pada index
			sb.append(padaIndex++ + "\t");
			//forms line
			for (Token t : p.getGrammarData()) {
				sb.append(t.getForm() + "\t");
			}
			sb.append("\n"); //newline
			//glossing line
			for (Token t : p.getGrammarData()) {
				sb.append("\t" + t.getLemma().replaceFirst("\\s+?\\d$", ""));
				for (String prop : LingConventions.GLOSSINGS_ORDER) {
					if (t.getProp(prop) != null) {
						sb.append("." + t.getProp(prop));
					}
				}
				sb.append("\t");
			}
			sb.append("\n\n");
		}
		return sb.delete(sb.length() - 2, sb.length()).toString();
	}
	

}
