package de.unikoeln.vedaweb.export;

import de.unikoeln.vedaweb.document.Pada;
import de.unikoeln.vedaweb.document.Stanza;
import de.unikoeln.vedaweb.document.Token;

public class GlossingsExport {
	
	private static String[] PROP_ORDER = new String[]{ "case", "person", "number", "gender", "tense", "mood", "voice"};
	
	private static final String HTML_DOC_TEMPLATE =
			"<!DOCTYPE html>\n" + 
			"<html>\n" + 
			"<head>\n" + 
			"	<meta charset=\"utf-8\">" +
			"	<title>###TITLE###</title>\n" + 
			"	<style>tr.forms {font-weight:bold;} table tr td {padding: 5px 10px;}</style>\n" +
			"</head>\n" + 
			"<body>\n" + 
			"	<h1>###HEADING###</h1>\n" +
			"	<table>\n" + 
			"		###TBODY###\n" + 
			"	</table>\n" + 
			"</body>\n" + 
			"</html>";
			
	
	public static String glossingsTxt(Stanza stanza) {
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
				for (String prop : PROP_ORDER) {
					if (t.getProp(prop) != null) {
						sb.append("." + t.getProp(prop));
					}
				}
				sb.append("\t");
			}
			sb.append("\n\n");
		}
		sb.append("(" + getExportTitle(stanza) + ")");
		return sb.toString();
	}
	
	
	public static String glossingsHtml(Stanza stanza) {
		StringBuilder sb = new StringBuilder();
		char padaIndex = 'a';
		
		for (Pada p : stanza.getPadas()) {
			sb.append("<tr class=\"forms\">");
			//pada index
			sb.append("<td>" + padaIndex++ + "</td>");
			//forms line
			for (Token t : p.getGrammarData()) {
				sb.append("<td>" + t.getForm() + "</td>");
			}
			sb.append("</tr><tr><td></td>");
			//glossing line
			for (Token t : p.getGrammarData()) {
				sb.append("<td>");
				sb.append(t.getLemma().replaceFirst("\\s+?\\d$", ""));
				for (String prop : PROP_ORDER) {
					if (t.getProp(prop) != null) {
						sb.append("." + t.getProp(prop));
					}
				}
				sb.append("</td>");
			}
			sb.append("</tr>");
		}
		
		String title = getExportTitle(stanza);
		
		return HTML_DOC_TEMPLATE
			.replaceFirst("###TITLE###", title)
			.replaceFirst("###HEADING###", title)
			.replaceFirst("###TBODY###", sb.toString());
	}
	
	
	private static String getExportTitle(Stanza stanza) {
		return "RV " + stanza.getBook() + "," +
				stanza.getHymn() + "," + stanza.getStanza();
	}

}
